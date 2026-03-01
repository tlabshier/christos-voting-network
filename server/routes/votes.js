const { Router } = require('express');
const { submitVote, submitBatchVotes, getVote } = require('../controllers/voteController');
const { rateLimitMiddleware } = require('../middleware/rateLimiter');

const router = Router();

router.post('/', rateLimitMiddleware, submitVote);
router.post('/batch', rateLimitMiddleware, submitBatchVotes);
router.get('/:id', getVote);

module.exports = router;
