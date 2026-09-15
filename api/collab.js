const ROOM_TTL_MS = 2 * 60 * 60 * 1000;

function getStore() {
  if (!global.__neonCollab) global.__neonCollab = new Map();
  return { rooms: global.__neonCollab };
}

function makeCode(rooms) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 4; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return rooms.has(code) ? makeCode(rooms) : code;
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
    if (now - room.updatedAt > ROOM_TTL_MS) store.rooms.delete(code);
  }

  if (req.method === 'GET') {
    const code = String(req.query.code || '').toUpperCase();
    const room = store.rooms.get(code);
    if (!room) return json(res, 404, { error: 'Room not found' });
    return json(res, 200, { code: room.code, ts: room.updatedAt, level: room.level });
  }

  if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed' });

  const body = req.body || {};
  const action = body.action;

  if (action === 'create') {
    const code = makeCode(store.rooms);
    const level = body.level || null;
    const room = { code, level, updatedAt: now };
    store.rooms.set(code, room);
    return json(res, 200, { code, ts: now });
  }

  if (action === 'update') {
    const code = String(body.code || '').toUpperCase();
    const room = store.rooms.get(code);
    if (!room) return json(res, 404, { error: 'Room not found' });
    if (!body.level) return json(res, 400, { error: 'No level provided' });
    room.level = body.level;
    room.updatedAt = now;
    return json(res, 200, { ok: true, ts: now });
  }

  return json(res, 400, { error: 'Unknown action' });
};
