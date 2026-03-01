const { getDatabase } = require('../config/database');

const CACHE_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

function getCachedQuestions(issueId) {
  const db = getDatabase();
  const row = db.prepare(`
    SELECT * FROM generated_questions
    WHERE issue_id = ?
    ORDER BY created_at DESC
    LIMIT 1
  `).get(issueId);

  if (!row) return null;

  // Check if cache is still fresh
  const age = Date.now() - new Date(row.created_at).getTime();
  if (age > CACHE_DURATION_MS) return null;

  try {
    return JSON.parse(row.questions_json);
  } catch {
    return null;
  }
}

function cacheQuestions(issueId, questions) {
  const db = getDatabase();
  db.prepare(`
    INSERT INTO generated_questions (issue_id, questions_json)
    VALUES (?, ?)
  `).run(issueId, JSON.stringify(questions));
}

module.exports = { getCachedQuestions, cacheQuestions };
