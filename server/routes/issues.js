const { Router } = require('express');
const { listIssues, getIssue } = require('../controllers/issueController');

const router = Router();

router.get('/', listIssues);
router.get('/:id', getIssue);

module.exports = router;
