const { getDatabase } = require('../config/database');

const REFRESH_INTERVAL = 10; // Refresh synthesis every N new submissions

function getCachedSynthesis(issueId) {
  const db = getDatabase();
  const row = db.prepare(`
    SELECT * FROM community_synthesis WHERE issue_id = ?
  `).get(issueId);

  if (!row) return null;

  try {
    return {
      synthesis: JSON.parse(row.synthesis_json),
      voteCount: row.vote_count,
      updatedAt: row.updated_at,
    };
  } catch {
    return null;
  }
}

function shouldRefresh(issueId, currentVoteCount) {
  const cached = getCachedSynthesis(issueId);
  if (!cached) return currentVoteCount >= 10; // First synthesis at 10 votes
  // Refresh every REFRESH_INTERVAL new submissions
  return currentVoteCount - cached.voteCount >= REFRESH_INTERVAL;
}

function saveSynthesis(issueId, synthesis, voteCount) {
  const db = getDatabase();
  db.prepare(`
    INSERT INTO community_synthesis (issue_id, synthesis_json, vote_count)
    VALUES (?, ?, ?)
    ON CONFLICT(issue_id) DO UPDATE SET
      synthesis_json = excluded.synthesis_json,
      vote_count = excluded.vote_count,
      updated_at = CURRENT_TIMESTAMP
  `).run(issueId, JSON.stringify(synthesis), voteCount);
}

module.exports = { getCachedSynthesis, shouldRefresh, saveSynthesis, REFRESH_INTERVAL };
