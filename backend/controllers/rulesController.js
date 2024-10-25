const { parseRuleString, combineRulesAST, evaluateAST } = require('../models/astModel');
const db = require('../db');

// Function to create a rule from string
const createRule = (req, res) => {
  const ruleString = req.body.rule;
  try {
    const ast = parseRuleString(ruleString);
    
    // Store AST in the database
    db.run(`INSERT INTO rules (rule_text, ast) VALUES (?, ?)`, [ruleString, JSON.stringify(ast)], function(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to store rule in database: ' + err.message });
      }
      console.log("AST",ast)
      res.json({ id: this.lastID, ast });
    });
  } catch (error) {
    res.status(400).json({ error: 'Invalid rule string: ' + error.message });
  }
};

// Function to combine rules
const combineRules = (req, res) => {
  const { ruleIds, operators } = req.body;

  if (!Array.isArray(ruleIds) || !Array.isArray(operators)) {
    return res.status(400).json({ error: 'ruleIds and operators must be arrays' });
  }

  if (ruleIds.length === 0 || operators.length !== ruleIds.length - 1) {
    return res.status(400).json({ error: 'Invalid input: operators must match the number of rules' });
  }

  try {
    // Use parameterized query to prevent SQL injection
    const placeholders = ruleIds.map(() => '?').join(',');
    db.all(`SELECT ast FROM rules WHERE id IN (${placeholders})`, ruleIds, (err, rows) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to fetch rules from database: ' + err.message });
      }

      if (rows.length !== ruleIds.length) {
        return res.status(404).json({ error: 'Some rule IDs were not found' });
      }

      const asts = rows.map(row => JSON.parse(row.ast));

      let combinedAST = asts[0]; 
      for (let i = 1; i < asts.length; i++) {
        const operator = operators[i - 1]; 
        combinedAST = combineRulesAST(combinedAST, asts[i], operator); 
      }

      res.json({ combinedAST });
    });
  } catch (error) {
    res.status(400).json({ error: 'Error combining rules: ' + error.message });
  }
};

// Function to evaluate rule against data
const evaluateRule = (req, res) => {
  const { ruleId, data } = req.body;

  try {
    db.get(`SELECT ast FROM rules WHERE id = ?`, [ruleId], (err, row) => {
      if (err || !row) {
        return res.status(404).json({ error: 'Rule not found' });
      }

      const ast = JSON.parse(row.ast);
      const result = evaluateAST(ast, data);
      res.json({ result });
    });
  } catch (error) {
    res.status(400).json({ error: 'Error evaluating rule: ' + error.message });
  }
};

// Get all rules
const getAllRules = (req, res) => {
  db.all(`SELECT id, rule_text AS name FROM rules`, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch rules: ' + err.message });
    }
    res.json(rows);
  });
};

module.exports = { createRule, combineRules, evaluateRule, getAllRules };
