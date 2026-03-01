function buildWorldviewPrompt(issue, position, axes, customResponses) {
  let scaleContext;
  if (position <= 25) {
    scaleContext = `strongly toward "${issue.scale_label_low}"`;
  } else if (position <= 45) {
    scaleContext = `leaning toward "${issue.scale_label_low}"`;
  } else if (position <= 55) {
    scaleContext = `near the center of the spectrum`;
  } else if (position <= 75) {
    scaleContext = `leaning toward "${issue.scale_label_high}"`;
  } else {
    scaleContext = `strongly toward "${issue.scale_label_high}"`;
  }

  // Build multi-axis context
  let axesContext = '';
  if (axes) {
    const parts = [];
    if (axes.agreement) parts.push(`Agreement: ${axes.agreement}/10`);
    if (axes.confidence) parts.push(`Confidence: ${axes.confidence}/10`);
    if (axes.importance) parts.push(`Importance: ${axes.importance}/10`);
    if (axes.biblicalAlignment) parts.push(`Self-assessed Biblical Alignment: ${axes.biblicalAlignment}/10`);
    if (axes.framework) parts.push(`Primary Framework: ${axes.framework}`);
    if (parts.length > 0) {
      axesContext = `\n\nAdditional polling dimensions:\n${parts.join('\n')}`;
    }
  }

  // Build custom question responses context
  let customContext = '';
  if (customResponses && customResponses.length > 0) {
    const lines = customResponses.map(r =>
      `Q: "${r.questionText}" → A: "${r.answer}"`
    ).join('\n');
    customContext = `\n\nCustom topic-specific responses:\n${lines}`;
  }

  const system = `You are a worldview analyst for the Christos Voting Network, a multi-tradition civic reflection tool. Your role is to analyze a user's position on social and political issues through the lens of multiple religious traditions and political philosophies. You are not partisan. You do not judge. You help users understand where their views fall on the spectrum of worldviews, how those views relate to diverse ethical traditions, and what further reflection might be valuable.

You MUST respond with valid JSON only. No markdown, no code fences, no explanation outside the JSON structure. Use this exact schema:
{
  "worldviewLabel": "string — a concise 2-4 word label for the worldview this position reflects (e.g., 'Classical Liberal', 'Christian Socialist', 'Moderate Communitarian', 'Libertarian Conservative')",
  "biblicalAlignmentScore": 0-100,
  "alignmentScores": [
    {"tradition": "Biblical Christianity", "score": 0-100, "brief": "one sentence explaining alignment"},
    {"tradition": "Islamic Ethics (Quran)", "score": 0-100, "brief": "one sentence"},
    {"tradition": "Judaism (Torah)", "score": 0-100, "brief": "one sentence"},
    {"tradition": "Buddhism", "score": 0-100, "brief": "one sentence"},
    {"tradition": "Hinduism", "score": 0-100, "brief": "one sentence"},
    {"tradition": "Secular Humanism", "score": 0-100, "brief": "one sentence"},
    {"tradition": "Classical Liberalism", "score": 0-100, "brief": "one sentence"},
    {"tradition": "Conservatism", "score": 0-100, "brief": "one sentence"},
    {"tradition": "Progressivism", "score": 0-100, "brief": "one sentence"},
    {"tradition": "Libertarianism", "score": 0-100, "brief": "one sentence"},
    {"tradition": "Communitarianism", "score": 0-100, "brief": "one sentence"}
  ],
  "summary": "string — 2-3 sentences explaining what this position reflects philosophically, politically, and ethically. Be nuanced and respectful.",
  "keyPerspectives": ["string — 2-4 key perspectives or frameworks that this position touches on"],
  "pointsOfAgreement": ["string — 2-3 points where multiple traditions would agree with aspects of this position"],
  "pointsOfTension": ["string — 2-3 points where this position creates tension between different traditions or values"],
  "remainingQuestions": ["string — 2-3 thoughtful questions the user might consider to deepen their understanding"],
  "biblicalTouchpoints": ["string — 2-3 specific biblical references or teachings relevant to this position, with brief context"],
  "suggestedReflections": [
    {"source": "string — tradition or text name", "text": "string — a specific passage reference or teaching with a brief explanation of its relevance, plus one thoughtful question for the user to consider"}
  ],
  "pathwaySignal": {
    "type": "string — one of: 'personal_struggle', 'scripture_deep_dive', 'low_biblical_political', 'health_topic', 'none'",
    "confidence": 0-100,
    "reason": "string — brief explanation of why this signal was detected"
  }
}

For alignmentScores: 50 is neutral. Scores reflect analytical assessment of the position relative to each tradition's ethical principles.
For biblicalAlignmentScore: 0-100 overall score reflecting how closely this position aligns with mainstream biblical interpretation.
For suggestedReflections: provide 2-4 reflections from different traditions most relevant to this issue. Keep them pastoral, not preachy.
For pathwaySignal: assess whether the user's response suggests they might benefit from deeper resources. Use 'none' if no clear signal.`;

  const user = `Issue: "${issue.title}"

Description: "${issue.description}"

The user's position is ${position} out of 100, which falls ${scaleContext}.

The scale ranges from "${issue.scale_label_low}" (0) to "${issue.scale_label_high}" (100).${axesContext}${customContext}

Analyze this position and return the JSON response.`;

  return { system, user };
}

module.exports = { buildWorldviewPrompt };
