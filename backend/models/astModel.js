// Function to parse rule string into AST
const parseRuleString = (ruleString) => {
  const operators = ['AND', 'OR'];
  const tokens = ruleString.match(/([a-zA-Z]+|[><=!]=?|[\(\)]|'[^']*'|\d+)/g);

  const parseRecursive = (tokens) => {
    if (tokens.length === 0) return null;

    let stack = [];
    let currentOperator = null;

    while (tokens.length > 0) {
      const token = tokens.shift();

      if (token === '(') {
        stack.push(parseRecursive(tokens)); // Recurse for nested parentheses
      } else if (token === ')') {
        break; // End of the current recursion
      } else if (operators.includes(token)) {
        currentOperator = token;
      } else {
        const operandAST = parseOperand(token, tokens);
        if (currentOperator && stack.length > 0) {
          const left = stack.pop();
          stack.push({ type: currentOperator, left, right: operandAST });
          currentOperator = null;
        } else {
          stack.push(operandAST);
        }
      }
    }

    return stack.length === 1 ? stack[0] : null;
  };

  return parseRecursive(tokens);
};

// Helper function to parse operands
const parseOperand = (operand, tokens) => {
  const attribute = operand;
  const operator = tokens.shift();
  const value = tokens.shift().replace(/'/g, '');

  return {
    type: 'operand',
    attribute,
    operator,
    comparisonValue: isNaN(value) ? value : Number(value),
  };
};


const combineRulesAST = (combinedAST, currentRuleAST, operator) => {
  if (!['AND', 'OR'].includes(operator)) {
    throw new Error(`Invalid operator: ${operator}. Only "AND" or "OR" are allowed.`);
  }

  return {
    type: operator,
    left: combinedAST,
    right: currentRuleAST,
  };
};
// Function to evaluate AST against data
const evaluateAST = (ast, data) => {
  const evaluateOperand = (operand) => {
    const { attribute, operator, comparisonValue } = operand;
    const attributeValue = data[attribute];

    if (attributeValue === undefined) return false;

    switch (operator) {
      case '>': return attributeValue > comparisonValue;
      case '<': return attributeValue < comparisonValue;
      case '=': return attributeValue == comparisonValue;
      case '!=': return attributeValue != comparisonValue;
      case '>=': return attributeValue >= comparisonValue;
      case '<=': return attributeValue <= comparisonValue;
      default: return false;
    }
  };

  if (ast.type === 'operand') {
    return evaluateOperand(ast);
  } else if (ast.type === 'AND') {
    return evaluateAST(ast.left, data) && evaluateAST(ast.right, data);
  } else if (ast.type === 'OR') {
    return evaluateAST(ast.left, data) || evaluateAST(ast.right, data);
  }

  return false;
};

module.exports = { parseRuleString, combineRulesAST, evaluateAST };
