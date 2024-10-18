
import './App.css'
import React, { useState } from 'react';

function App() {
  const [rule, setRule] = useState(''); // To store the rule
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
      console.log('AST:', responseData.ast);
      setAst(responseData.ast); // Store the AST for evaluation
    } catch (error) {
      console.error('Error creating rule:', error);
    }
  };

  const handleEvaluateRule = async () => {
    try {
      // Ensure the AST and data are ready for evaluation
      if (!ast || Object.keys(data).length === 0) {
        console.error('AST or data is not defined');
        return;
      }

      const response = await fetch('http://localhost:5000/api/evaluateRule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ast, data }), // Use the stored AST and current data
      });
      const responseData = await response.json();
      console.log('Evaluation Result:', responseData);
      setResult(responseData.result); // Update the result state with evaluation result
    } catch (error) {
      console.error('Error evaluating rule:', error);
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
        <h2>Evaluate Rule</h2>
        <div className='eval-txt'>
        <textarea
          placeholder="Enter data in JSON format"
          onChange={(e) => {
            try {
              setData(JSON.parse(e.target.value)); // Parse JSON input safely
            } catch (err) {
              console.error('Invalid JSON format:', err);
              setData({}); // Reset data on error
            }
          }}
        ></textarea>
        <button onClick={handleEvaluateRule} className='btn'>Evaluate</button>
     
        </div>
         </div>

      {result !== null && <h3>Result: {result ? 'True' : 'False'}</h3>}
    </div>
  );
}

export default App;
