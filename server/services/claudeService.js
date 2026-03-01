const Anthropic = require('@anthropic-ai/sdk');
const { buildWorldviewPrompt } = require('../utils/promptBuilder');
const { buildQuestionPrompt } = require('../utils/questionGenerator');
const { parseClaudeResponse } = require('../utils/responseParser');

const MODEL = 'claude-sonnet-4-20250514';
const MAX_RETRIES = 3;
const RETRY_DELAYS = [1000, 2000, 4000];

let client;

function getClient() {
  if (!client) {
    client = new Anthropic({ apiKey: process.env.CLAUDE_API_KEY });
  }
  return client;
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function callClaude(system, userMessage, maxTokens = 2048) {
  let lastError;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const response = await getClient().messages.create({
        model: MODEL,
        max_tokens: maxTokens,
        system,
        messages: [{ role: 'user', content: userMessage }],
      });

      return {
        text: response.content[0].text,
        model: MODEL,
      };
    } catch (err) {
      lastError = err;
      const status = err.status || err.statusCode;

      if ((status === 429 || status === 529) && attempt < MAX_RETRIES - 1) {
        console.warn(`Claude API attempt ${attempt + 1} failed (${status}), retrying in ${RETRY_DELAYS[attempt]}ms...`);
        await sleep(RETRY_DELAYS[attempt]);
        continue;
      }

      throw err;
    }
  }

  throw lastError;
}

async function analyzeVote(issue, position, axes, customResponses) {
  const prompt = buildWorldviewPrompt(issue, position, axes, customResponses);
  const { text, model } = await callClaude(prompt.system, prompt.user, 3000);
  const analysis = parseClaudeResponse(text);

  return { analysis, rawResponse: text, model };
}

async function generateQuestions(issue) {
  const prompt = buildQuestionPrompt(issue);
  const { text } = await callClaude(prompt.system, prompt.user, 1024);

  let cleaned = text.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
  }

  const parsed = JSON.parse(cleaned);

  if (!parsed.questions || !Array.isArray(parsed.questions)) {
    throw new Error('Invalid question generation response');
  }

  return parsed.questions.map(q => ({
    id: String(q.id || `q_${Math.random().toString(36).slice(2, 8)}`),
    text: String(q.text || ''),
    options: (q.options || []).map(o => ({
      value: String(o.value || ''),
      label: String(o.label || ''),
    })),
  })).filter(q => q.text && q.options.length >= 2);
}

async function generateCommunitySynthesis(issue, votes) {
  const system = `You are a community analyst for the Christos Voting Network. You analyze aggregate voting data to find patterns, areas of agreement, and points of tension within a community of voters.

You MUST respond with valid JSON only. No markdown, no code fences. Use this exact schema:
{
  "keyPerspectives": ["string — 3-5 key perspectives represented in the community responses"],
  "pointsOfAgreement": ["string — 2-4 areas where the community tends to agree"],
  "pointsOfTension": ["string — 2-4 areas where the community is most divided"],
  "remainingQuestions": ["string — 2-3 questions the community might benefit from exploring together"],
  "biblicalTouchpoints": ["string — 2-3 biblical themes or passages relevant to the community's range of views"],
  "communityInsight": "string — 2-3 sentences summarizing the overall community perspective and what stands out"
}`;

  const votesSummary = votes.map((v, i) => {
    let line = `Voter ${i + 1}: position=${v.position}/100`;
    if (v.agreement) line += `, agreement=${v.agreement}/10`;
    if (v.confidence) line += `, confidence=${v.confidence}/10`;
    if (v.importance) line += `, importance=${v.importance}/10`;
    if (v.biblical_alignment_input) line += `, biblical_alignment=${v.biblical_alignment_input}/10`;
    if (v.framework) line += `, framework="${v.framework}"`;
    return line;
  }).join('\n');

  const positions = votes.map(v => v.position);
  const avgPosition = Math.round(positions.reduce((a, b) => a + b, 0) / positions.length);
  const minPos = Math.min(...positions);
  const maxPos = Math.max(...positions);

  const user = `Issue: "${issue.title}"
Description: "${issue.description}"
Scale: "${issue.scale_label_low}" (0) to "${issue.scale_label_high}" (100)

Community statistics:
- Total votes: ${votes.length}
- Average position: ${avgPosition}/100
- Range: ${minPos} to ${maxPos}
- Standard deviation: ${Math.round(stdDev(positions))}

Individual responses:
${votesSummary}

Analyze this community's collective response and return the JSON.`;

  const { text } = await callClaude(system, user, 2048);

  let cleaned = text.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
  }

  return JSON.parse(cleaned);
}

function stdDev(arr) {
  const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
  const squareDiffs = arr.map(v => (v - mean) ** 2);
  return Math.sqrt(squareDiffs.reduce((a, b) => a + b, 0) / arr.length);
}

module.exports = { analyzeVote, generateQuestions, generateCommunitySynthesis };
