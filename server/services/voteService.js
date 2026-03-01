const { getDatabase } = require('../config/database');

function create({ issueId, position, userId, axes, customResponses, ipAddress }) {
  const db = getDatabase();
  const result = db.prepare(`
    INSERT INTO votes (issue_id, position, user_id, agreement, confidence, importance,
      biblical_alignment_input, framework, custom_responses, ip_address)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    issueId,
    position,
    userId || null,
    axes?.agreement || null,
    axes?.confidence || null,
    axes?.importance || null,
    axes?.biblicalAlignment || null,
    axes?.framework || null,
    customResponses ? JSON.stringify(customResponses) : null,
    ipAddress || null
  );

  return result.lastInsertRowid;
}

function updateAnalysis(voteId, {
  worldviewLabel, alignmentScores, summary, suggestedReflections,
  biblicalAlignmentScore, keyPerspectives, pointsOfAgreement, pointsOfTension,
  remainingQuestions, biblicalTouchpoints, pathwaySignal,
  rawClaudeResponse, claudeModel,
}) {
  const db = getDatabase();
  db.prepare(`
    UPDATE votes SET
      worldview_label = ?,
      alignment_scores = ?,
      summary = ?,
      suggested_reflections = ?,
      biblical_alignment_score = ?,
      key_perspectives = ?,
      points_of_agreement = ?,
      points_of_tension = ?,
      remaining_questions = ?,
      biblical_touchpoints = ?,
      pathway_signal = ?,
      raw_claude_response = ?,
      claude_model = ?
    WHERE id = ?
  `).run(
    worldviewLabel,
    JSON.stringify(alignmentScores),
    summary,
    JSON.stringify(suggestedReflections),
    biblicalAlignmentScore || null,
    JSON.stringify(keyPerspectives || []),
    JSON.stringify(pointsOfAgreement || []),
    JSON.stringify(pointsOfTension || []),
    JSON.stringify(remainingQuestions || []),
    JSON.stringify(biblicalTouchpoints || []),
    JSON.stringify(pathwaySignal || { type: 'none' }),
    rawClaudeResponse,
    claudeModel,
    voteId
  );
}

function hydrateVote(row) {
  if (!row) return row;
  const jsonFields = [
    'alignment_scores', 'suggested_reflections', 'key_perspectives',
    'points_of_agreement', 'points_of_tension', 'remaining_questions',
    'biblical_touchpoints', 'pathway_signal', 'custom_responses',
  ];
  for (const field of jsonFields) {
    if (row[field] && typeof row[field] === 'string') {
      try { row[field] = JSON.parse(row[field]); } catch { /* leave as string */ }
    }
  }
  return row;
}

function getById(id) {
  const db = getDatabase();
  const row = db.prepare(`
    SELECT v.*, i.title as issue_title, i.description as issue_description
    FROM votes v
    JOIN issues i ON v.issue_id = i.id
    WHERE v.id = ?
  `).get(id);
  return hydrateVote(row);
}

function getByUserId(userId) {
  const db = getDatabase();
  const rows = db.prepare(`
    SELECT v.*, i.title as issue_title
    FROM votes v
    JOIN issues i ON v.issue_id = i.id
    WHERE v.user_id = ?
    ORDER BY v.created_at DESC
  `).all(userId);
  return rows.map(hydrateVote);
}

function getByIssueId(issueId) {
  const db = getDatabase();
  const rows = db.prepare(`
    SELECT * FROM votes WHERE issue_id = ? ORDER BY created_at DESC
  `).all(issueId);
  return rows.map(hydrateVote);
}

function getVoteCountForIssue(issueId) {
  const db = getDatabase();
  const row = db.prepare('SELECT COUNT(*) as count FROM votes WHERE issue_id = ?').get(issueId);
  return row.count;
}

module.exports = { create, updateAnalysis, getById, getByUserId, getByIssueId, getVoteCountForIssue };
