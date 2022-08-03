#! /usr/bin/env node

import * as acorn from "acorn"
import fs from "fs"
import * as walk from "acorn-walk"
import yargs from "yargs/yargs"
import { walkRec } from "./cli"

export const argv = yargs(process.argv.slice(2)).options({
  depth: { type: 'number', default: 2 },
  inputFile: { type: 'string', demandOption: true },
}).argv;

walkRec();

// const maxRecursionDepth = argv.depth
// const data = fs.readFileSync(argv.inputFile, 'utf8');

// let outString = "";
// let setLetterCount = 65;
// let letterCount = setLetterCount;
// const maxNodesVisited = 1;
// const supported: Array<string> = ["BinaryExpression"]


// const BinaryHandler = (node: any, recursionDepth: number): string => {
//   if ((recursionDepth >= maxRecursionDepth) || ((!(supported.includes(node.left.type))) && (!(supported.includes(node.right.type))))) {
//     letterCount += 2;
//     return "(" + String.fromCharCode(letterCount-2) + node.operator + String.fromCharCode(letterCount-1) + ")";

//   } else {
//     if (((supported.includes(node.left.type))) && (!(supported.includes(node.right.type)))) {
//       letterCount += 1;
//       return "(" + String.fromCharCode(letterCount - 1) + node.operator + BinaryHandler(node.left, recursionDepth + 1) + ")"
//     }

//     if (((!(supported.includes(node.left.type)))) && (supported.includes(node.right.type))) {
//       letterCount += 1;
//       return "(" + String.fromCharCode(letterCount - 1) + node.operator + BinaryHandler(node.right, recursionDepth + 1) + ")"
//     }

//     if (((supported.includes(node.left.type))) && (supported.includes(node.right.type))) {
//       letterCount += 1;
//       if ((node.left.operator.charCodeAt(0) <= node.right.operator.charCodeAt(0)) && (node.left.operator.length >= node.right.operator.length)){
//         return "(" + BinaryHandler(node.left, recursionDepth + 1) + node.operator + BinaryHandler(node.right, recursionDepth + 1) + ")"
//       }
//       else {
//         return "(" + BinaryHandler(node.right, recursionDepth + 1) + node.operator + BinaryHandler(node.left, recursionDepth + 1) + ")"
//       }      
//     }
//   }

//   return "error: case not caught"

// }


// const funcs: walk.RecursiveVisitors<string> = {BinaryExpression: (node, st, c) => {
//   const binaryExpressionNode = node as any
//   const { nodesVisited } = JSON.parse(st)
//   if (nodesVisited <= maxNodesVisited) {
//     letterCount = setLetterCount
//     console.log(BinaryHandler(binaryExpressionNode, 0));
//     const updatedNodesVisited = nodesVisited + 1;
//     const updatedState = JSON.stringify({ nodesVisited: updatedNodesVisited });
//     c(binaryExpressionNode.left, updatedState)
//     c(binaryExpressionNode.right, updatedState)
//   }
// },
// // IfStatement: (node, st, c) => {
// //   const ifStatementNode = node as any
// //   console.log("ifnode")
// //   c(ifStatementNode.test, st)
// //   c(ifStatementNode.consequent, st)
// //   if (ifStatementNode.alternate) c(ifStatementNode.alternate, st)
// //   }
// };



// walk.recursive(acorn.parse(data, {ecmaVersion: 2020}), JSON.stringify({nodesVisited: 0}), walk.make(funcs))




