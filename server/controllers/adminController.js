const issueService = require('../services/issueService');

async function createIssue(req, res, next) {
  try {
    const { title, description, category, voteType, scaleLabelLow, scaleLabelHigh } = req.body;

    if (!title || !description) {
      return res.status(400).json({ error: { code: 'MISSING_FIELDS', message: 'title and description are required' } });
    }

    const issue = issueService.create({ title, description, category, voteType, scaleLabelLow, scaleLabelHigh });
    res.status(201).json({ issue });
  } catch (err) {
    next(err);
  }
}

async function updateIssue(req, res, next) {
  try {
    const existing = issueService.getById(Number(req.params.id));
    if (!existing) {
      return res.status(404).json({ error: { code: 'ISSUE_NOT_FOUND', message: 'Issue not found' } });
    }

    const issue = issueService.update(Number(req.params.id), req.body);
    res.json({ issue });
  } catch (err) {
    next(err);
  }
}

module.exports = { createIssue, updateIssue };
