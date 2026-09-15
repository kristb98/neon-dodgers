const LEVEL_TTL_MS = 30 * 24 * 60 * 60 * 1000;
const MAX_LEVELS = 200;

function getStore() {
  if (!global.__neonLevels) global.__neonLevels = new Map();
  return { levels: global.__neonLevels };
}

function makeCode(levels) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 5; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return levels.has(code) ? makeCode(levels) : code;
}

function prune(levels, now) {
  for (const [code, lv] of levels) {
    if (now - lv.uploadedAt > LEVEL_TTL_MS) levels.delete(code);
  }
  if (levels.size > MAX_LEVELS) {
    const sorted = [...levels.entries()].sort((a, b) => a[1].uploadedAt - b[1].uploadedAt);
    const overflow = sorted.length - MAX_LEVELS;
    for (let i = 0; i < overflow; i++) levels.delete(sorted[i][0]);
  }
}

function summary(lv) {
  return {
    code: lv.code,
    name: lv.level.name || 'My Level',
    author: lv.level.author || 'Player',
    scroll: lv.level.scroll || 'vertical',
    rows: lv.level.rows || 0,
    uploadedAt: lv.uploadedAt
  };
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
  prune(store.levels, now);

  if (req.method === 'GET') {
    const code = String(req.query.code || req.query.id || '').toUpperCase();
    if (code) {
      const lv = store.levels.get(code);
      if (!lv) return json(res, 404, { error: 'Level not found' });
      return json(res, 200, { level: lv.level, code: lv.code });
    }
    const list = [...store.levels.values()].sort((a, b) => b.uploadedAt - a.uploadedAt).slice(0, 50).map(summary);
    return json(res, 200, { levels: list });
  }

  if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed' });

  const body = req.body || {};
  const action = body.action;

  if (action === 'create' || action === 'upload') {
    if (!body.level) return json(res, 400, { error: 'No level provided' });
    const code = makeCode(store.levels);
    const lv = {
      code,
      level: body.level,
      uploadedAt: now
    };
    store.levels.set(code, lv);
    return json(res, 200, { code, level: body.level });
  }

  return json(res, 400, { error: 'Unknown action' });
};
