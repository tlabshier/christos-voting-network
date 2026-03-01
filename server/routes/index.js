const { Router } = require('express');
const { getRemainingVotes, DAILY_LIMIT } = require('../middleware/rateLimiter');

const router = Router();

router.use('/issues', require('./issues'));
router.use('/votes', require('./votes'));
router.use('/admin', require('./admin'));
router.use('/shares', require('./shares'));
router.use('/questions', require('./questions'));
router.use('/synthesis', require('./synthesis'));

// Rate limit check endpoint
router.get('/rate-limit', (req, res) => {
  const ip = req.ip || req.connection.remoteAddress || 'unknown';
  const remaining = getRemainingVotes(ip);
  res.json({ remaining, limit: DAILY_LIMIT });
});

module.exports = router;
