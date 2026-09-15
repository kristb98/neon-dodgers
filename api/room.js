const MAX_PLAYERS = 5;
const MIN_PLAYERS = 2;
const ROOM_TTL_MS = 30 * 60 * 1000;

function getStore() {
  if (!global.__neonRooms) global.__neonRooms = new Map();
  if (!global.__neonPlayerRooms) global.__neonPlayerRooms = new Map();
  return { rooms: global.__neonRooms, playerRooms: global.__neonPlayerRooms };
}

function makeCode(rooms) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 4; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return rooms.has(code) ? makeCode(rooms) : code;
}

function makeId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function roomPayload(room) {
  return {
    code: room.code,
    hostId: room.hostId,
    difficulty: room.difficulty,
    playerCount: room.playerCount,
    started: room.started,
    startAt: room.startAt,
    winnerId: room.winnerId || null,
    players: room.players.map((p) => ({
      id: p.id,
      name: p.name,
      ready: p.ready,
      score: p.score,
      alive: p.alive,
      isHost: p.id === room.hostId
    }))
  };
}

function cleanupRoom(code, store) {
  const room = store.rooms.get(code);
  if (!room) return;
  room.players.forEach((p) => store.playerRooms.delete(p.id));
  store.rooms.delete(code);
}

function leaveRoom(playerId, store) {
  const code = store.playerRooms.get(playerId);
  if (!code) return null;
  const room = store.rooms.get(code);
  if (!room) {
    store.playerRooms.delete(playerId);
    return null;
  }

  room.players = room.players.filter((p) => p.id !== playerId);
  store.playerRooms.delete(playerId);

  if (room.players.length === 0) {
    cleanupRoom(code, store);
    return { empty: true };
  }

  if (room.hostId === playerId) {
    room.hostId = room.players[0].id;
  }

  return { room: roomPayload(room) };
}

function checkWinner(room) {
  if (!room.started || room.winnerId) return;
  const alive = room.players.filter((p) => p.alive);
  if (alive.length <= 1 && room.players.length > 1) {
    room.winnerId = alive[0] ? alive[0].id : null;
  }
}

function json(res, status, data) {
  res.status(status).json(data);
}

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const store = getStore();
  const now = Date.now();

  for (const [code, room] of store.rooms) {
    if (!room.started && now - room.createdAt > ROOM_TTL_MS) cleanupRoom(code, store);
  }

  if (req.method === 'GET') {
    const code = String(req.query.code || '').toUpperCase();
    const room = store.rooms.get(code);
    if (!room) return json(res, 404, { error: 'Room not found' });
    return json(res, 200, { room: roomPayload(room) });
  }

  if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed' });

  const body = req.body || {};
  const action = body.action;

  if (action === 'create') {
    const playerId = makeId();
    const code = makeCode(store.rooms);
    const name = String(body.name || 'Player').slice(0, 16);
    const playerCount = Math.min(MAX_PLAYERS, Math.max(MIN_PLAYERS, body.playerCount || 2));
    const difficulty = Math.max(0, Math.min(9, body.difficulty ?? 2));

    const room = {
      code,
      hostId: playerId,
      difficulty,
      playerCount,
      started: false,
      startAt: null,
      winnerId: null,
      createdAt: now,
      players: [{ id: playerId, name, ready: false, score: 0, alive: true }]
    };

    store.rooms.set(code, room);
    store.playerRooms.set(playerId, code);
    return json(res, 200, { playerId, room: roomPayload(room) });
  }

  if (action === 'join') {
    const playerId = makeId();
    const code = String(body.code || '').toUpperCase();
    const room = store.rooms.get(code);
    if (!room) return json(res, 404, { error: 'Room not found' });
    if (room.started) return json(res, 400, { error: 'Race already started' });
    if (room.players.length >= room.playerCount) {
      return json(res, 400, { error: 'Room is full' });
    }

    const name = String(body.name || 'Player').slice(0, 16);
    room.players.push({ id: playerId, name, ready: false, score: 0, alive: true });
    store.playerRooms.set(playerId, code);
    return json(res, 200, { playerId, room: roomPayload(room) });
  }

  const playerId = body.playerId;
  const code = store.playerRooms.get(playerId);
  const room = code ? store.rooms.get(code) : null;

  if (action === 'leave') {
    leaveRoom(playerId, store);
    return json(res, 200, { ok: true });
  }

  if (!room) return json(res, 400, { error: 'Not in a room' });
  const player = room.players.find((p) => p.id === playerId);
  if (!player) return json(res, 400, { error: 'Player not found' });

  if (action === 'ready') {
    player.ready = !!body.ready;
    return json(res, 200, { room: roomPayload(room) });
  }

  if (action === 'start') {
    if (playerId !== room.hostId) return json(res, 403, { error: 'Only host can start' });
    if (room.players.length < MIN_PLAYERS) {
      return json(res, 400, { error: 'Need at least 2 players' });
    }
    if (!room.players.every((p) => p.ready)) {
      return json(res, 400, { error: 'All players must be ready' });
    }

    room.started = true;
    room.startAt = Date.now() + 4000;
    room.winnerId = null;
    room.players.forEach((p) => {
      p.score = 0;
      p.alive = true;
    });
    return json(res, 200, { room: roomPayload(room) });
  }

  if (action === 'state') {
    if (!room.started) return json(res, 400, { error: 'Race not started' });
    player.score = Math.max(0, body.score | 0);
    player.alive = body.alive !== false;
    checkWinner(room);
    return json(res, 200, { room: roomPayload(room) });
  }

  if (action === 'poll') {
    return json(res, 200, { room: roomPayload(room) });
  }

  return json(res, 400, { error: 'Unknown action' });
};
