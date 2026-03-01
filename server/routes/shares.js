const { Router } = require('express');
const shareService = require('../services/shareService');

const router = Router();

// Create a share
router.post('/', (req, res, next) => {
  try {
    const { resultData, isBatch } = req.body;

    if (!resultData) {
      return res.status(400).json({ error: { code: 'MISSING_DATA', message: 'resultData is required' } });
    }

    const token = shareService.createShare({ resultData, isBatch: !!isBatch });
    res.status(201).json({ shareToken: token });
  } catch (err) {
    next(err);
  }
});

// Get a share
router.get('/:token', (req, res, next) => {
  try {
    const share = shareService.getByToken(req.params.token);
    if (!share) {
      return res.status(404).json({ error: { code: 'SHARE_NOT_FOUND', message: 'Shared result not found' } });
    }
    res.json({ share });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
