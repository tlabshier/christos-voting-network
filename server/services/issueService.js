const { getDatabase } = require('../config/database');

function getAll() {
  const db = getDatabase();
  return db.prepare('SELECT * FROM issues WHERE is_active = 1 ORDER BY sort_order ASC').all();
}

function getById(id) {
  const db = getDatabase();
  return db.prepare('SELECT * FROM issues WHERE id = ?').get(id);
}

function create({ title, description, category, voteType, scaleLabelLow, scaleLabelHigh, createdBy }) {
  const db = getDatabase();
  const maxOrder = db.prepare('SELECT MAX(sort_order) as max_order FROM issues').get();
  const sortOrder = (maxOrder.max_order || 0) + 1;

  const result = db.prepare(`
    INSERT INTO issues (title, description, category, vote_type, scale_label_low, scale_label_high, sort_order, created_by)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(title, description, category || 'general', voteType || 'scale', scaleLabelLow || 'Strongly Disagree', scaleLabelHigh || 'Strongly Agree', sortOrder, createdBy || null);

  return getById(result.lastInsertRowid);
}

function update(id, fields) {
  const db = getDatabase();
  const allowed = ['title', 'description', 'category', 'vote_type', 'scale_label_low', 'scale_label_high', 'is_active', 'sort_order'];
  const updates = [];
  const values = [];

  for (const [key, value] of Object.entries(fields)) {
    const dbKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    if (allowed.includes(dbKey)) {
      updates.push(`${dbKey} = ?`);
      values.push(value);
    }
  }

  if (updates.length === 0) return getById(id);

  updates.push('updated_at = CURRENT_TIMESTAMP');
  values.push(id);

  db.prepare(`UPDATE issues SET ${updates.join(', ')} WHERE id = ?`).run(...values);
  return getById(id);
}

module.exports = { getAll, getById, create, update };
