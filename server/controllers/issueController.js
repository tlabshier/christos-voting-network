const issueService = require('../services/issueService');

async function listIssues(req, res, next) {
  try {
    const issues = issueService.getAll();
    res.json({ issues });
  } catch (err) {
    next(err);
  }
}

async function getIssue(req, res, next) {
  try {
    const issue = issueService.getById(Number(req.params.id));
    if (!issue) {
      return res.status(404).json({ error: { code: 'ISSUE_NOT_FOUND', message: 'Issue not found' } });
    }
    res.json({ issue });
  } catch (err) {
    next(err);
  }
}

module.exports = { listIssues, getIssue };
