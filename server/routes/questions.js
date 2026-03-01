const { Router } = require('express');
const issueService = require('../services/issueService');
const claudeService = require('../services/claudeService');
const questionService = require('../services/questionService');

const router = Router();

// GET /api/questions/:issueId — get AI-generated custom questions for an issue
router.get('/:issueId', async (req, res, next) => {
  try {
    const issueId = Number(req.params.issueId);
    const issue = issueService.getById(issueId);

    if (!issue) {
      return res.status(404).json({ error: { code: 'ISSUE_NOT_FOUND', message: 'Issue not found' } });
    }

    // Check cache first
    const cached = questionService.getCachedQuestions(issueId);
    if (cached) {
      return res.json({ questions: cached, cached: true });
    }

    // Generate new questions via Claude
    const questions = await claudeService.generateQuestions(issue);

    // Cache for future requests
    questionService.cacheQuestions(issueId, questions);

    res.json({ questions, cached: false });
  } catch (err) {
    console.error('Question generation error:', err.message);
    // Return empty questions on failure — don't block voting
    res.json({ questions: [], error: 'Custom questions unavailable' });
  }
});

module.exports = router;
