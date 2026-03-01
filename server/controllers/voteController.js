const voteService = require('../services/voteService');
const issueService = require('../services/issueService');
const claudeService = require('../services/claudeService');

async function submitVote(req, res, next) {
  try {
    const { issueId, position, userId, axes, customResponses } = req.body;

    if (issueId == null || position == null) {
      return res.status(400).json({ error: { code: 'MISSING_FIELDS', message: 'issueId and position are required' } });
    }

    const pos = Number(position);
    if (!Number.isInteger(pos) || pos < 0 || pos > 100) {
      return res.status(400).json({ error: { code: 'INVALID_POSITION', message: 'Position must be an integer 0-100' } });
    }

    const issue = issueService.getById(Number(issueId));
    if (!issue) {
      return res.status(404).json({ error: { code: 'ISSUE_NOT_FOUND', message: 'Issue not found' } });
    }

    const validatedAxes = validateAxes(axes);
    const ipAddress = req.ip || req.connection?.remoteAddress || 'unknown';

    const voteId = voteService.create({
      issueId: Number(issueId),
      position: pos,
      userId: userId || null,
      axes: validatedAxes,
      customResponses: customResponses || null,
      ipAddress,
    });

    try {
      const { analysis, rawResponse, model } = await claudeService.analyzeVote(
        issue, pos, validatedAxes, customResponses
      );

      voteService.updateAnalysis(voteId, {
        worldviewLabel: analysis.worldviewLabel,
        alignmentScores: analysis.alignmentScores,
        summary: analysis.summary,
        suggestedReflections: analysis.suggestedReflections,
        biblicalAlignmentScore: analysis.biblicalAlignmentScore,
        keyPerspectives: analysis.keyPerspectives,
        pointsOfAgreement: analysis.pointsOfAgreement,
        pointsOfTension: analysis.pointsOfTension,
        remainingQuestions: analysis.remainingQuestions,
        biblicalTouchpoints: analysis.biblicalTouchpoints,
        pathwaySignal: analysis.pathwaySignal,
        rawClaudeResponse: rawResponse,
        claudeModel: model,
      });

      return res.status(201).json({
        vote: {
          id: voteId,
          issueId: Number(issueId),
          position: pos,
          axes: validatedAxes,
          analysis,
          createdAt: new Date().toISOString(),
        },
      });
    } catch (claudeError) {
      console.error('Claude API error:', claudeError.message);
      return res.status(201).json({
        vote: {
          id: voteId,
          issueId: Number(issueId),
          position: pos,
          axes: validatedAxes,
          analysis: null,
          createdAt: new Date().toISOString(),
        },
        warning: 'Vote recorded but analysis unavailable. It can be generated later.',
      });
    }
  } catch (err) {
    next(err);
  }
}

async function submitBatchVotes(req, res, next) {
  try {
    const { votes: voteInputs, userId } = req.body;

    if (!Array.isArray(voteInputs) || voteInputs.length === 0) {
      return res.status(400).json({
        error: { code: 'MISSING_FIELDS', message: 'votes array is required and must not be empty' },
      });
    }

    if (voteInputs.length > 20) {
      return res.status(400).json({
        error: { code: 'TOO_MANY_VOTES', message: 'Maximum 20 votes per batch' },
      });
    }

    const ipAddress = req.ip || req.connection?.remoteAddress || 'unknown';

    const resolvedVotes = [];
    for (const v of voteInputs) {
      if (v.issueId == null || v.position == null) {
        return res.status(400).json({
          error: { code: 'MISSING_FIELDS', message: 'Each vote must have issueId and position' },
        });
      }
      const pos = Number(v.position);
      if (!Number.isInteger(pos) || pos < 0 || pos > 100) {
        return res.status(400).json({
          error: { code: 'INVALID_POSITION', message: `Invalid position ${v.position} for issue ${v.issueId}` },
        });
      }
      const issue = issueService.getById(Number(v.issueId));
      if (!issue) {
        return res.status(404).json({
          error: { code: 'ISSUE_NOT_FOUND', message: `Issue ${v.issueId} not found` },
        });
      }
      resolvedVotes.push({
        issue,
        position: pos,
        axes: validateAxes(v.axes),
        customResponses: v.customResponses || null,
      });
    }

    const results = [];
    for (const { issue, position, axes, customResponses } of resolvedVotes) {
      const voteId = voteService.create({
        issueId: issue.id,
        position,
        userId: userId || null,
        axes,
        customResponses,
        ipAddress,
      });

      let analysis = null;
      let warning = null;
      try {
        const { analysis: a, rawResponse, model } = await claudeService.analyzeVote(
          issue, position, axes, customResponses
        );
        voteService.updateAnalysis(voteId, {
          worldviewLabel: a.worldviewLabel,
          alignmentScores: a.alignmentScores,
          summary: a.summary,
          suggestedReflections: a.suggestedReflections,
          biblicalAlignmentScore: a.biblicalAlignmentScore,
          keyPerspectives: a.keyPerspectives,
          pointsOfAgreement: a.pointsOfAgreement,
          pointsOfTension: a.pointsOfTension,
          remainingQuestions: a.remainingQuestions,
          biblicalTouchpoints: a.biblicalTouchpoints,
          pathwaySignal: a.pathwaySignal,
          rawClaudeResponse: rawResponse,
          claudeModel: model,
        });
        analysis = a;
      } catch (claudeError) {
        console.error(`Claude API error for issue ${issue.id}:`, claudeError.message);
        warning = 'Analysis unavailable for this issue.';
      }

      results.push({
        id: voteId,
        issueId: issue.id,
        issueTitle: issue.title,
        position,
        axes,
        analysis,
        warning,
        createdAt: new Date().toISOString(),
      });
    }

    return res.status(201).json({ votes: results });
  } catch (err) {
    next(err);
  }
}

async function getVote(req, res, next) {
  try {
    const vote = voteService.getById(Number(req.params.id));
    if (!vote) {
      return res.status(404).json({ error: { code: 'VOTE_NOT_FOUND', message: 'Vote not found' } });
    }
    res.json({ vote });
  } catch (err) {
    next(err);
  }
}

function validateAxes(axes) {
  if (!axes) return null;
  const validated = {};
  if (axes.agreement) validated.agreement = clamp(Number(axes.agreement), 1, 10);
  if (axes.confidence) validated.confidence = clamp(Number(axes.confidence), 1, 10);
  if (axes.importance) validated.importance = clamp(Number(axes.importance), 1, 10);
  if (axes.biblicalAlignment) validated.biblicalAlignment = clamp(Number(axes.biblicalAlignment), 1, 10);
  if (axes.framework) validated.framework = String(axes.framework);
  return Object.keys(validated).length > 0 ? validated : null;
}

function clamp(val, min, max) {
  return Math.max(min, Math.min(max, Math.round(val)));
}

module.exports = { submitVote, submitBatchVotes, getVote };
