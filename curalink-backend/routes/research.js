const express = require('express');
const router = express.Router();
const { handleResearch } = require('../controllers/researchController');

router.get('/status', (req, res) => {
  res.json({ status: 'Research API ready' });
});

router.post('/', handleResearch);

module.exports = router;
