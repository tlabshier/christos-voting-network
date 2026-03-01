const crypto = require('crypto');
const { getDatabase } = require('../config/database');

function generateToken() {
  return crypto.randomBytes(8).toString('hex'); // 16-char hex string
}

function createShare({ resultData, isBatch }) {
  const db = getDatabase();
  const token = generateToken();

  db.prepare(`
    INSERT INTO shared_results (share_token, result_data, is_batch)
    VALUES (?, ?, ?)
  `).run(token, JSON.stringify(resultData), isBatch ? 1 : 0);

  return token;
}

function getByToken(token) {
  const db = getDatabase();
  const row = db.prepare('SELECT * FROM shared_results WHERE share_token = ?').get(token);
  if (!row) return null;

  try {
    row.result_data = JSON.parse(row.result_data);
  } catch { /* leave as string */ }

  return row;
}

module.exports = { createShare, getByToken };
