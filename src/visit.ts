import * as acorn from "acorn"
import fs from "fs"
import * as walk from "acorn-walk"
import { argv } from "yargs";

let setLetterCount = 65;
let letterCount = setLetterCount;
const supported: Array<string> = ["BinaryExpression", "LogicalExpression", "ConditionalExpression", "UnaryExpression"];
let constants = [""];
let associative = [""]
let maxRecursionDepth = 2;
const foundPatterns: {[pattern: string]: number} = {};
let errorCount = 0;

const BinaryHandler = (node: any, recursionDepth: number): string => {
  let switchable = false;
  let left = "";
  let right = "";
  if (associative.includes(node.operator)) {
    if (!(node.left.type.includes("Expression") && node.right.type.includes("Expression")) && (node.right.type > node.left.type)) {
      switchable = true
    }
  }
  if (recursionDepth >= maxRecursionDepth) {
    if (switchable) {
      return "(" + ConstantTest(node.right) + " " + node.operator + " " + ConstantTest(node.left) + ")";
    }
    return "(" + ConstantTest(node.left) + " " + node.operator + " " + ConstantTest(node.right) + ")";
  }
  if (switchable) {
    left = (supported.includes(node.right.type)) ? codePattern(node.right, recursionDepth + 1) : ConstantTest(node.right);
    right = (supported.includes(node.left.type)) ? codePattern(node.left, recursionDepth + 1) : ConstantTest(node.left);
  } else {
    left = (supported.includes(node.left.type)) ? codePattern(node.left, recursionDepth + 1) : ConstantTest(node.left);
    right = (supported.includes(node.right.type)) ? codePattern(node.right, recursionDepth + 1) : ConstantTest(node.right);
  }
  return "(" + left + " " + node.operator + " " + right + ")";
}

const ConditionalHandler = (node: any, recursionDepth: number): string => {
  if (recursionDepth >= maxRecursionDepth) {
    return "(" + ConstantTest(node.test) + " ? " + ConstantTest(node.consequent) + " : " + ConstantTest(node.alternate) + ")";
  }
  const test = (supported.includes(node.test.type)) ? codePattern(node.test, recursionDepth + 1) : ConstantTest(node.test);
  const consequent = (supported.includes(node.consequent.type)) ? codePattern(node.consequent, recursionDepth + 1) : ConstantTest(node.consequent);
  const alternate = (supported.includes(node.alternate.type)) ? codePattern(node.alternate, recursionDepth + 1) : ConstantTest(node.alternate);

  return "(" + test + " ? " + consequent + " : " + alternate + ")";
}

const UnaryHandler = (node: any, recursionDepth: number): string => {
  if (recursionDepth >= maxRecursionDepth) {
    if (node.prefix) {
      return node.operator + "(" + ConstantTest(node.argument) + ")";
    }
    return "(" + ConstantTest(node.argument) + ")" + node.operator;
  }
  const argument = (supported.includes(node.argument.type)) ? codePattern(node.argument, recursionDepth + 1) : ConstantTest(node.argument);

  if (node.prefix) {
    return node.operator + "(" + argument + ")";
  }
  return "(" + argument + ")" + node.operator;
}

const ConstantTest = (node: any): string => {
  if (constants.includes(node.value)) {
    return node.raw;
  }
  if (node.type == "Literal") {
    letterCount += 1;
    return "'" + String.fromCharCode(letterCount - 1) + ": " + typeof (node.value) + "'";
  }
  else {
    letterCount += 1;
    return "'" + String.fromCharCode(letterCount - 1) + ": " + node.type + "'";
  }
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
    case "UnaryExpression":
      return UnaryHandler(node, recursionDepth);
      break;
  };
  return "";
}

const generateVisitor: walk.RecursiveVisitors<string> = {
  BinaryExpression: (node, st, c) => {
    const binaryExpressionNode = node as any;
    letterCount = setLetterCount;
    const pattern = codePattern(binaryExpressionNode, 0);
    (foundPatterns[pattern]) ? foundPatterns[pattern] += 1 : foundPatterns[pattern] = 1;
    c(binaryExpressionNode.left, st)
    c(binaryExpressionNode.right, st)
  },
  LogicalExpression: (node, st, c) => {
    const logicalExpressionNode = node as any;
    letterCount = setLetterCount;
    const pattern = codePattern(logicalExpressionNode, 0);
    (foundPatterns[pattern]) ? foundPatterns[pattern] += 1 : foundPatterns[pattern] = 1;
    c(logicalExpressionNode.left, st)
    c(logicalExpressionNode.right, st)
  },
  ConditionalExpression: (node, st, c) => {
    const conditionalExpressionNode = node as any;
    letterCount = setLetterCount;
    const pattern = codePattern(conditionalExpressionNode, 0);
    (foundPatterns[pattern]) ? foundPatterns[pattern] += 1 : foundPatterns[pattern] = 1;
    c(conditionalExpressionNode.test, st)
    c(conditionalExpressionNode.consequent, st)
    c(conditionalExpressionNode.alternate, st)
  },
  UnaryExpression: (node, st, c) => {
    const unaryExpressionNode = node as any;
    letterCount = setLetterCount;
    const pattern = codePattern(unaryExpressionNode, 0);
    (foundPatterns[pattern]) ? foundPatterns[pattern] += 1 : foundPatterns[pattern] = 1;
    c(unaryExpressionNode.argument, st);
  },
}

export const walkRec = (opts: { maxRecursionDepth?: number, inputFile?: string, constants?: Array<any>, associative?: Array<any> } = {}): [{ [pattern: string]: number }, number] => {
  maxRecursionDepth = opts.maxRecursionDepth || 2;
  const inputFile = opts.inputFile || "";
  const data = fs.readFileSync(inputFile, 'utf8');
  constants = opts.constants || [0, -1, 1, false, true, "", "string", "number", "boolean", "function", "undefined", "object", "null", null];
  associative = opts.associative || ["==", "===", "*"]
  try {
    walk.recursive(acorn.parse(data, { ecmaVersion: 2022, sourceType: "module", allowHashBang: true, allowReturnOutsideFunction: true }), "", walk.make(generateVisitor));
  } catch (error) {
    errorCount += 1;
    console.error("error in", inputFile, error);
  }
  return([foundPatterns, errorCount])
}
