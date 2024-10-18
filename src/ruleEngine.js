
function parseOperand(operand) {
    const tokens = operand.split(' ');
    return [tokens[0], tokens[1], isNaN(tokens[2]) ? tokens[2].replace(/'/g, "") : parseInt(tokens[2])]; // Handle string values with quotes
}

// Helper function to compare two values based on an operator
function compare(dataValue, operator, ruleValue) {
    switch (operator) {
        case '>': return dataValue > ruleValue;
        case '<': return dataValue < ruleValue;
        case '==': return dataValue == ruleValue;
        case '!=': return dataValue != ruleValue;
        case '>=': return dataValue >= ruleValue;
        case '<=': return dataValue <= ruleValue;
        default: throw new Error(`Unsupported operator: ${operator}`);
    }
}

// Function to create an AST from a rule string
function createRule(ruleString) {
    const operators = ['AND', 'OR'];
    let tokens = ruleString.match(/\(|\)|[^\s()]+/g); // Split the rule string by spaces and parentheses
    let astStack = []; // To handle nesting of AST

    // Iterate through the tokens to build the AST
    for (let i = 0; i < tokens.length; i++) {
        if (tokens[i] === '(') {
            astStack.push(tokens[i]); // Push opening parenthesis to the stack
        } else if (tokens[i] === ')') {
            let subExpression = [];
            while (astStack.length > 0 && astStack[astStack.length - 1] !== '(') {
                subExpression.unshift(astStack.pop()); // Build the subexpression from inside parentheses
            }
            astStack.pop(); // Remove the '('
            astStack.push(buildAST(subExpression)); // Push the AST of the subexpression onto the stack
        } else if (operators.includes(tokens[i])) {
            astStack.push(tokens[i]); // Push operator to the stack
        } else {
            astStack.push({
                type: 'operand',
                value: `${tokens[i]} ${tokens[i + 1]} ${tokens[i + 2]}` // Handle conditions
            });
            i += 2; // Skip the next two tokens as they are part of the operand
        }
    }

    return buildAST(astStack); // Build the final AST from the remaining stack
}

// Helper function to build AST from tokens
function buildAST(tokens) {
    if (tokens.length === 1) {
        return tokens[0]; // Single operand or already built AST
    }

    // Find the first operator and split into left and right parts
    for (let i = 0; i < tokens.length; i++) {
        if (tokens[i] === 'AND' || tokens[i] === 'OR') {
            return {
                type: 'operator',
                value: tokens[i],
                left: buildAST(tokens.slice(0, i)), // Recursively build the left AST
                right: buildAST(tokens.slice(i + 1)) // Recursively build the right AST
            };
        }
    }
    throw new Error("Invalid rule structure");
}

// Function to combine multiple rules into a single AST
function combineRules(rules) {
    let combinedAst = null;

    for (const rule of rules) {
        const ast = createRule(rule);
        if (!combinedAst) {
            combinedAst = ast; // First rule becomes the root AST
        } else {
            combinedAst = {
                type: 'operator',
                value: 'AND', // Combine rules with AND operator
                left: combinedAst,
                right: ast
            };
        }
    }

    return combinedAst;
}

// Function to evaluate the AST against provided data
function evaluateRule(ast, data) {
    if (ast.type === 'operand') {
        const [key, operator, value] = parseOperand(ast.value); // Extract condition details
        if (data[key] === undefined) throw new Error(`Attribute ${key} not found in data`);
        return compare(data[key], operator, value); // Compare the data attribute with the rule condition
    } else if (ast.type === 'operator') {
        const leftResult = evaluateRule(ast.left, data); // Recursively evaluate left AST
        const rightResult = evaluateRule(ast.right, data); // Recursively evaluate right AST
        return ast.value === 'AND' ? leftResult && rightResult : leftResult || rightResult; // Handle AND/OR operators
    }
    throw new Error("Invalid AST node type");
}

// Export functions for use in other modules
module.exports = { createRule, combineRules, evaluateRule };
