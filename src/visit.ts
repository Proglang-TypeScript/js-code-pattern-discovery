import * as acorn from "acorn"
import fs from "fs"
import * as walk from "acorn-walk"

let setLetterCount = 65;
let letterCount = setLetterCount;
const supported: Array<string> = ["BinaryExpression", "LogicalExpression", "ConditionalExpression"];
let constants = [""];
let maxRecursionDepth = 2;
const foundPatterns: Array<string> = [];

const BinaryHandler = (node: any, recursionDepth: number): string => {
  if (recursionDepth >= maxRecursionDepth) {
    return "(" + ConstantTest(node.left) + " " + node.operator + " " + ConstantTest(node.right) + ")";
  }

  const left = (supported.includes(node.left.type)) ? codePattern(node.left, recursionDepth + 1) : ConstantTest(node.left);
  const right = (supported.includes(node.right.type)) ? codePattern(node.right, recursionDepth + 1) : ConstantTest(node.right);

  return "(" + left + " " + node.operator + " " + right + ")";
}

const ConditionalHandler = (node: any, recursionDepth: number): string => {
  const test = (supported.includes(node.test.type)) ? codePattern(node.test, recursionDepth + 1) : ConstantTest(node.test);
  const consequent = (supported.includes(node.consequent.type)) ? codePattern(node.consequent, recursionDepth + 1) : ConstantTest(node.consequent);
  const alternate = (supported.includes(node.alternate.type)) ? codePattern(node.alternate, recursionDepth + 1) : ConstantTest(node.alternate);

  return "(" + test + " ? " + consequent + " : " + alternate + ")";
}

const ConstantTest = (node: any): string => {
  if (constants.includes(node.value)) {
    return "'" + node.value + ": " + typeof(node.value) + "'";
  }
  letterCount += 1;
  return String.fromCharCode(letterCount - 1);
} 
  
const codePattern = (node: any, recursionDepth: number): string => {
  switch (node.type) {
    case "BinaryExpression":
      return BinaryHandler(node, recursionDepth);
      break;
    case "LogicalExpression":
      return BinaryHandler(node, recursionDepth);
      break;
    case "ConditionalExpression":
      return ConditionalHandler(node, recursionDepth);
      break;
  };
  return "";
}

const generateVisitor: walk.RecursiveVisitors<string> = {
  BinaryExpression: (node, st, c) => {
    const binaryExpressionNode = node as any;
    letterCount = setLetterCount;
    const pattern = codePattern(binaryExpressionNode, 0);
    if (!(foundPatterns.includes(pattern))) {
      foundPatterns.push(pattern);
    }
    c(binaryExpressionNode.left, st)
    c(binaryExpressionNode.right, st)
  },
  LogicalExpression: (node, st, c) => {
    const logicalExpressionNode = node as any;
    letterCount = setLetterCount;
    const pattern = codePattern(logicalExpressionNode, 0);
    if (!(foundPatterns.includes(pattern))) {
      foundPatterns.push(pattern);
    }
    c(logicalExpressionNode.left, st)
    c(logicalExpressionNode.right, st)
  },
  ConditionalExpression: (node, st, c) => {
    const conditionalExpressionNode = node as any;
    letterCount = setLetterCount;
    const pattern = codePattern(conditionalExpressionNode, 0);
    if (!(foundPatterns.includes(pattern))) {
      foundPatterns.push(pattern);
    }
    c(conditionalExpressionNode.test, st)
    c(conditionalExpressionNode.consequent, st)
    c(conditionalExpressionNode.alternate, st)
  },
}

export const walkRec = (opts: { maxRecursionDepth?: number, inputFile?: string, constants?: Array<any> } = {}) => {
  maxRecursionDepth = opts.maxRecursionDepth || 2;
  const inputFile = opts.inputFile || "";
  // const inputFile = new URL("file://github.com/lodash/lodash/blob/master/.internal/Hash.js")
  const data = fs.readFileSync(inputFile, 'utf8');
  constants = opts.constants || [0, 1, "0", "1", false, true, ""];
  walk.recursive(acorn.parse(data, { ecmaVersion: 2020 }), "", walk.make(generateVisitor));
  return(foundPatterns)
}