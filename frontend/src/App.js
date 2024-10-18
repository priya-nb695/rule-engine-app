import './App.css';
import React, { useState } from 'react';

function App() {
  const [rule, setRule] = useState(''); // To store the rule
  const [rulesList, setRulesList] = useState([]); // To store multiple rules
  const [data, setData] = useState({}); // To store the input data
  const [ast, setAst] = useState(null); // To store the AST
  const [result, setResult] = useState(null); // To store the evaluation result

  const handleCreateRule = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/createRule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rule }),
      });
      const responseData = await response.json();
      if (!response.ok) {
        alert(`Error creating rule: ${responseData.error}`);
        return;
      }
      console.log('AST:', responseData.ast);
      setAst(responseData.ast); // Store the AST for evaluation
      alert("Single Rule Creation Succesfull!");
    } catch (error) {
      alert('An error occurred while creating the rule. Please try again.');
      console.error('Error creating rule:', error);
    }
  };

  const handleCombineRules = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/combineRules', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rules: rulesList }), // Send the combined rules
      });
      const responseData = await response.json();
      if (!response.ok) {
        alert(`Error combining rules: ${responseData.error}`);
        return;
      }
      console.log('Combined AST:', responseData.ast);
      setAst(responseData.ast); // Store the combined AST for evaluation
      alert("Combined AST Creation Succesfull!");
    } catch (error) {
      alert('An error occurred while combining rules. Please try again.');
      console.error('Error combining rules:', error);
    }
  };

  const handleEvaluateCombinedRule = async () => {
    try {
      if (!ast || Object.keys(data).length === 0) {
        alert('Please create rules and provide valid data for evaluation.');
        console.error('AST or data is not defined');
        return;
      }

      const response = await fetch('http://localhost:5000/api/evaluateRule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ast, data }), // ast is the combined AST from the previous step
      });
      const responseData = await response.json();
      if (!response.ok) {
        alert(`Error evaluating rule: ${responseData.error}`);
        return;
      }
      console.log('Evaluation Result:', responseData);
      setResult(responseData.result); // Update the result state with evaluation result
  
    } catch (error) {
      alert('An error occurred while evaluating the combined rule. Please try again.');
      console.error('Error evaluating combined rule:', error);
    }
  };

  return (
    <div className="App">
      <h1>Rule Engine App</h1>

      <div>
        <label>Enter Rule:</label>
        <input
          type="text"
          value={rule}
          onChange={(e) => setRule(e.target.value)}
          placeholder="e.g., age > 30 AND department == 'Sales'"
        />
        <button onClick={handleCreateRule} className='btn'>Create Rule</button>
      </div>

      <div>
        <h2>Add Multiple Rules to Combine</h2>
        <input
          type="text"
          placeholder="Enter complete rule to combine"
          onChange={(e) => setRule(e.target.value)}
        />
        <button onClick={() => {
          if (rule.trim()) {
            setRulesList([...rulesList, rule]);
            setRule(''); // Clear input field after adding
          } else {
            alert('Please enter a valid rule.');
          }
        }} className='btn'>Add Rule</button>
        <button onClick={handleCombineRules} className='btn'>Combine Rules</button>
        <div>
          <h3>Rules to Combine:</h3>
          <ul>
            {rulesList.map((r, index) => (
              <li key={index}>{r}</li>
            ))}
          </ul>
        </div>
      </div>

      <div>
        <h2>Evaluate Combined Rule</h2>
        <textarea
          placeholder="Enter data in JSON format"
          onChange={(e) => {
            try {
              setData(JSON.parse(e.target.value)); // Parse JSON input safely
            } catch (err) {
              console.error('Invalid JSON format:', err);
              setData({}); // Reset data on error
              alert('Invalid JSON format. Please check your input.');
            }
          }}
        ></textarea>
        <button onClick={handleEvaluateCombinedRule} className='btn'>Evaluate</button>
      </div>

      {result !== null && <h3>Result: {result ? 'True' : 'False'}</h3>}
    </div>
  );
}

export default App;
