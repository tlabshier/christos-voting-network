const { Router } = require('express');
const issueService = require('../services/issueService');
const voteService = require('../services/voteService');
const claudeService = require('../services/claudeService');
const synthesisService = require('../services/synthesisService');

const router = Router();

// GET /api/synthesis/:issueId — get community synthesis for an issue
router.get('/:issueId', async (req, res, next) => {
  try {
    const issueId = Number(req.params.issueId);
    const issue = issueService.getById(issueId);

    if (!issue) {
      return res.status(404).json({ error: { code: 'ISSUE_NOT_FOUND', message: 'Issue not found' } });
    }

    const voteCount = voteService.getVoteCountForIssue(issueId);

    // Not enough votes yet
    if (voteCount < 10) {
      return res.json({
        available: false,
        voteCount,
        threshold: 10,
        message: `Community synthesis requires at least 10 votes. Currently ${voteCount}.`,
      });
    }

    // Check if we need to refresh
    const needsRefresh = synthesisService.shouldRefresh(issueId, voteCount);
    const cached = synthesisService.getCachedSynthesis(issueId);

    if (cached && !needsRefresh) {
      return res.json({
        available: true,
        voteCount,
        synthesis: cached.synthesis,
        lastUpdated: cached.updatedAt,
      });
    }

    // Generate new synthesis
    try {
      const votes = voteService.getByIssueId(issueId);
      const synthesis = await claudeService.generateCommunitySynthesis(issue, votes);
      synthesisService.saveSynthesis(issueId, synthesis, voteCount);

      return res.json({
        available: true,
        voteCount,
        synthesis,
        lastUpdated: new Date().toISOString(),
      });
    } catch (err) {
      console.error('Synthesis generation error:', err.message);

      // Return cached if available, otherwise error
      if (cached) {
        return res.json({
          available: true,
          voteCount,
          synthesis: cached.synthesis,
          lastUpdated: cached.updatedAt,
          warning: 'Using cached synthesis. Refresh failed.',
        });
      }

      return res.json({
        available: false,
        voteCount,
        message: 'Community synthesis generation failed. Please try again later.',
      });
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
