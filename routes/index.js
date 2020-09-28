const express = require('express');
const router = express.Router();
const Snippet = require('../models/Snippet');

// @route   GET /
// @desc    Index page of Sniplary
// @access  Private
router.get('/', async (req, res) => {
  res.render('index');
});

module.exports = router;
