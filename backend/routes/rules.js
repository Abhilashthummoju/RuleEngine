const express = require('express');
const router = express.Router();
const { createRule, combineRules, evaluateRule, getAllRules } = require('../controllers/rulesController');

// Create a rule
router.post('/create', createRule);

// Combine rules
router.post('/combine', combineRules);

// Evaluate a rule
router.post('/evaluate', evaluateRule);

// Fetch all rules
router.get('/getRules', getAllRules);

module.exports = router;
