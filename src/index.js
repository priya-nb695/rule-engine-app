const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { createRule, combineRules, evaluateRule } = require('./ruleEngine');
const Rule = require('../models/Rule');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/rule-engine', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("Connected to MongoDB");
}).catch((err) => {
  console.error("Error connecting to MongoDB:", err);
});

// API to create rule and store AST in MongoDB
app.post('/api/createRule', async (req, res) => {
  try {
    const { rule } = req.body;
    const ast = createRule(rule);
    const newRule = new Rule({ ruleString: rule, ast });
    await newRule.save();
    res.status(200).json({ ast });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// API to evaluate rule based on user data
app.post('/api/evaluateRule', async (req, res) => {
  try {
    const { ast, data } = req.body;
    const result = evaluateRule(ast, data);
    res.status(200).json({ result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// API to combine multiple rules
app.post('/api/combineRules', async (req, res) => {
  try {
    const { rules } = req.body; // Expecting an array of rules
    const combinedAST = combineRules(rules);
    res.status(200).json({ ast: combinedAST });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
