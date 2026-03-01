const REQUIRED_FIELDS = ['worldviewLabel', 'alignmentScores', 'summary', 'suggestedReflections'];

function parseClaudeResponse(text) {
  // Strip markdown code fences if present
  let cleaned = text.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
  }

  const parsed = JSON.parse(cleaned);

  // Validate required fields
  for (const field of REQUIRED_FIELDS) {
    if (!(field in parsed)) {
      throw new Error(`Claude response missing required field: ${field}`);
    }
  }

  // Validate alignmentScores is an array with proper structure
  if (!Array.isArray(parsed.alignmentScores) || parsed.alignmentScores.length === 0) {
    throw new Error('alignmentScores must be a non-empty array');
  }

  // Clamp each score to 0-100
  parsed.alignmentScores = parsed.alignmentScores.map(entry => ({
    tradition: String(entry.tradition || 'Unknown'),
    score: Math.max(0, Math.min(100, Math.round(Number(entry.score) || 50))),
    brief: String(entry.brief || ''),
  }));

  // Validate suggestedReflections is an array
  if (!Array.isArray(parsed.suggestedReflections)) {
    parsed.suggestedReflections = [];
  }

  parsed.suggestedReflections = parsed.suggestedReflections.map(entry => ({
    source: String(entry.source || 'Unknown'),
    text: String(entry.text || ''),
  }));

  // Expanded fields — normalize with defaults
  parsed.biblicalAlignmentScore = Math.max(0, Math.min(100,
    Math.round(Number(parsed.biblicalAlignmentScore) || 50)
  ));

  parsed.keyPerspectives = normalizeStringArray(parsed.keyPerspectives);
  parsed.pointsOfAgreement = normalizeStringArray(parsed.pointsOfAgreement);
  parsed.pointsOfTension = normalizeStringArray(parsed.pointsOfTension);
  parsed.remainingQuestions = normalizeStringArray(parsed.remainingQuestions);
  parsed.biblicalTouchpoints = normalizeStringArray(parsed.biblicalTouchpoints);

  // Pathway signal
  if (parsed.pathwaySignal && typeof parsed.pathwaySignal === 'object') {
    parsed.pathwaySignal = {
      type: String(parsed.pathwaySignal.type || 'none'),
      confidence: Math.max(0, Math.min(100,
        Math.round(Number(parsed.pathwaySignal.confidence) || 0)
      )),
      reason: String(parsed.pathwaySignal.reason || ''),
    };
  } else {
    parsed.pathwaySignal = { type: 'none', confidence: 0, reason: '' };
  }

  return parsed;
}

function normalizeStringArray(val) {
  if (!Array.isArray(val)) return [];
  return val.map(item => String(item || '')).filter(s => s.length > 0);
}

module.exports = { parseClaudeResponse };
