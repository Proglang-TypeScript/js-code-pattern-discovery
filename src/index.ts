import * as acorn from "acorn"
import fs from "fs"
import * as walk from "acorn-walk"
import yargs from "yargs/yargs"

let outString = "";
let setLetterCount = 65;
let letterCount = setLetterCount;
const maxNodesVisited = 0;
const supported: Array<string> = ["BinaryExpression", "LogicalExpression", "ConditionalExpression"]
const left = ""
const right = ""

const argv = yargs(process.argv.slice(2)).options({
  depth: { type: 'number', default: 2 },
  inputFile: { type: 'string', demandOption: true },
}).argv;
const maxRecursionDepth = argv.depth

const data = fs.readFileSync(argv.inputFile, 'utf8');


const BinaryHandler = (node: any, recursionDepth: number): string => {
  // if ((recursionDepth >= maxRecursionDepth) || ((!(supported.includes(node.left.type))) && (!(supported.includes(node.right.type))))) {
  //   letterCount += 2;
  //   return "(" + String.fromCharCode(letterCount-2) + node.operator + String.fromCharCode(letterCount-1) + ")";

  // } else {
  //   if (((supported.includes(node.left.type))) && (!(supported.includes(node.right.type)))) {
  //     letterCount += 1;
  //     return "(" + String.fromCharCode(letterCount - 1) + node.operator + codePattern(node.left, recursionDepth + 1) + ")"
  //   }

  //   if (((!(supported.includes(node.left.type)))) && (supported.includes(node.right.type))) {
  //     letterCount += 1;
  //     return "(" + String.fromCharCode(letterCount - 1) + node.operator + codePattern(node.right, recursionDepth + 1) + ")"
  //   }

  //   if (((supported.includes(node.left.type))) && (supported.includes(node.right.type))) {
  //     letterCount += 1;
  //     if ((node.left.operator.charCodeAt(0) <= node.right.operator.charCodeAt(0)) && (node.left.operator.length >= node.right.operator.length)){
  //       return "(" + codePattern(node.left, recursionDepth + 1) + node.operator + codePattern(node.right, recursionDepth + 1) + ")"
  //     }
  //     else {
  //       return "(" + codePattern(node.right, recursionDepth + 1) + node.operator + codePattern(node.left, recursionDepth + 1) + ")"
  //     }      
  //   }
  // }
  
  const left = (supported.includes(node.left.type)) ? codePattern(node.left, recursionDepth + 1) : String.fromCharCode(letterCount);
  if (!(supported.includes(node.left.type))) {letterCount += 1};
  const right = (supported.includes(node.right.type)) ? codePattern(node.right, recursionDepth + 1) : String.fromCharCode(letterCount);
  if (!(supported.includes(node.right.type))) {letterCount += 1};

  return "(" + left + node.operator + right + ")";
}

const ConditionalHandler = (node: any, recursionDepth: number): string => {
  const test = (supported.includes(node.test.type)) ? codePattern(node.test, recursionDepth + 1) : String.fromCharCode(letterCount);
  if (!(supported.includes(node.test.type))) {letterCount += 1};
  const consequent = (supported.includes(node.consequent.type)) ? codePattern(node.consequent, recursionDepth + 1) : String.fromCharCode(letterCount);
  if (!(supported.includes(node.consequent.type))) {letterCount += 1};
  const alternate = (supported.includes(node.alternate.type)) ? codePattern(node.alternate, recursionDepth + 1) : String.fromCharCode(letterCount);
  if (!(supported.includes(node.alternate.type))) {letterCount += 1};

  return "(" + test + "?" + consequent + ":" + alternate + ")";
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

const funcs: walk.RecursiveVisitors<string> = {
  BinaryExpression: (node, st, c) => {
    const binaryExpressionNode = node as any
    const { nodesVisited } = JSON.parse(st)
    if (nodesVisited <= maxNodesVisited) {
      letterCount = setLetterCount
      console.log(codePattern(binaryExpressionNode, 0));
      const updatedNodesVisited = nodesVisited + 1;
      const updatedState = JSON.stringify({ nodesVisited: updatedNodesVisited });
      c(binaryExpressionNode.left, updatedState)
      c(binaryExpressionNode.right, updatedState)
    };
  },
  LogicalExpression: (node, st, c) => {
    const { nodesVisited } = JSON.parse(st)
    const LogicalExpressionNode = node as any
    if (nodesVisited <= maxNodesVisited) {
      letterCount = setLetterCount;
      const updatedNodesVisited = nodesVisited + 1;
      const updatedState = JSON.stringify({ nodesVisited: updatedNodesVisited });
      
      console.log(codePattern(LogicalExpressionNode, 0));
      c(LogicalExpressionNode.left, st)
      c(LogicalExpressionNode.right, st)
    };
  },
  ConditionalExpression: (node, st, c) => {
    const { nodesVisited } = JSON.parse(st)
    const ConditionalExpressionNode = node as any;
    if (nodesVisited <= maxNodesVisited) {
      letterCount = setLetterCount;
      const updatedNodesVisited = nodesVisited + 1;
      const updatedState = JSON.stringify({ nodesVisited: updatedNodesVisited });

      console.log(codePattern(ConditionalExpressionNode, 0));
      c(ConditionalExpressionNode.test, st)
      c(ConditionalExpressionNode.consequent, st)
      c(ConditionalExpressionNode.alternate, st)
    };
  },
};



walk.recursive(acorn.parse(data, {ecmaVersion: 2020}), JSON.stringify({nodesVisited: 0}), walk.make(funcs))




