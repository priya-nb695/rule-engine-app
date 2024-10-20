const { createRule, combineRules, evaluateRule } = require('../src/ruleEngine'); // Adjust the path to your ruleEngine

describe('Rule Engine', () => {
  
  // Test case 1: Create individual rules and verify AST representation
  test('should create a valid AST for a simple rule', () => {
    const rule = "age > 30";
    const ast = createRule(rule);
    
    expect(ast).toBeDefined(); // Check if AST is generated
    expect(ast).toHaveProperty('type'); // Check if it contains a type property
    expect(ast.type).toBe('operand'); // Example assertion for the AST type
  });

  // Test case 2: Combine rules and verify the combined AST
  test('should combine multiple rules and create a valid combined AST', () => {
    const rules = ["age > 30", "department == 'Sales'"];
    const combinedAST = combineRules(rules);
    
    expect(combinedAST).toBeDefined();
    expect(combinedAST).toHaveProperty('type');
    expect(combinedAST.type).toBe('operator'); // Example for combined logic
  });

  // Test case 3: Evaluate a rule based on sample data
  test('should evaluate a rule correctly for given data', () => {
    const rule = "age > 30";
    const ast = createRule(rule);
    const data = { age: 40 };
    const result = evaluateRule(ast, data);
    
    expect(result).toBe(true); // Expect result to be true since 40 > 30
  });

  // Test case 4: Test evaluation with combined rules
  test('should evaluate combined rules correctly for given data', () => {
    const rules = ["age > 30", "department == 'Sales'"];
    const combinedAST = combineRules(rules);
    const data = { age: 35, department: 'Sales' };
    const result = evaluateRule(combinedAST, data);
    
    expect(result).toBe(true); // Expect true since both conditions match
  });

  // Test case 5: Fail scenario for evaluation
  test('should return false if data does not meet the combined rules', () => {
    const rules = ["age > 30", "department == 'Sales'"];
    const combinedAST = combineRules(rules);
    const data = { age: 25, department: 'Marketing' };
    const result = evaluateRule(combinedAST, data);
    
    expect(result).toBe(false); // Expect false since both conditions fail
  });
});
