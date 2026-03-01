const { Router } = require('express');
const { createIssue, updateIssue } = require('../controllers/adminController');

const router = Router();

router.post('/issues', createIssue);
router.put('/issues/:id', updateIssue);

module.exports = router;
