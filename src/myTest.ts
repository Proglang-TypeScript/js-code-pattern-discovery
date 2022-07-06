import * as acorn from "acorn"
import fs from "fs"
import * as walk from "acorn-walk"

let outString = "";
let letterCount = 65;
const maxDepth = 2;
const maxRecursionDepth = 3;

const data = fs.readFileSync('myTestFile.ts', 'utf8');


const BinaryHandler = (node: any, recursionDepth: number): string => {
  if ((recursionDepth >= maxRecursionDepth) || ((node.left.type != "BinaryExpression") && node.right.type != "BinaryExpression") ) {
    letterCount += 2;
    return "(" + String.fromCharCode(letterCount-2) + node.operator + String.fromCharCode(letterCount-1) + ")";

  } else {
    if ((node.left.type == "BinaryExpression") && (node.right.type != "BinaryExpression")) {
      letterCount += 1;
      return "(" + String.fromCharCode(letterCount - 1) + node.operator + BinaryHandler(node.left, recursionDepth + 1) + ")"
    }

    if ((node.left.type != "BinaryExpression") && (node.right.type == "BinaryExpression")) {
      letterCount += 1;
      return "(" + String.fromCharCode(letterCount - 1) + node.operator + BinaryHandler(node.right, recursionDepth + 1) + ")"
    }

    if ((node.left.type == "BinaryExpression") && (node.right.type == "BinaryExpression")) {
      letterCount += 1;
      return "(" + BinaryHandler(node.left, recursionDepth + 1) + node.operator + BinaryHandler(node.right, recursionDepth + 1) + ")"
    }
  }

  return "error: case not caught"

  // if ((node.left.type == "BinaryExpression") || (node.right.type == "BinaryExpression")) {
  //   outString = outString + node.operator + "(";
  // } else {
  //   outString = outString + node.operator;
  // }
  // console.log(outString);
}


const funcs: walk.RecursiveVisitors<string> = {BinaryExpression: (node, st, c) => {
  const binaryExpressionNode = node as any
  // console.log(depth)
  const { depth } = JSON.parse(st)
  if (depth <= maxDepth) {
    letterCount = 65
    console.log(depth)
    console.log(BinaryHandler(binaryExpressionNode, 0));
    const updatedDepth = depth + 1;
    const updatedState = JSON.stringify({ depth: updatedDepth });
    c(binaryExpressionNode.left, updatedState)
    c(binaryExpressionNode.right, updatedState)
  }
}
};

// const funcs: walk.RecursiveVisitors<string> = {Program: (node, st, c) => {
//   const updatedState = JSON.stringify({depth: 0})
//   for (let stmt of node.body)
//     c(stmt, updatedState, "Statement")
// }};

// funcs.BinaryExpression = (node, st, c, depth) => {
//   console.log(depth)
//   BinaryHandler(node);
//   c(node.left, st, "Expression", depth - 1)
//   c(node.right, st, "Expression", depth - 1)
// };

// funcs.Program = (node, st, c) => {
//   const updatedState = JSON.stringify({depth: 0})
//   for (let stmt of node.body)
//     c(stmt, updatedState, "Statement")
// };
// funcs.Expression = (node, st, c, depth) => {
//   c(node, st, undefined, depth)
// };
// funcs.VariableDeclaration = (node, st, c, depth) => {
//   for (let decl of node.declarations)
//     c(decl, st, undefined, depth)
// };
// funcs.VariableDeclarator = (node, st, c, depth) => {
//   c(node.id, st, "Pattern", depth)
//   if (node.init) c(node.init, st, "Expression", depth)
// };

walk.recursive(acorn.parse(data, {ecmaVersion: 2020}), JSON.stringify({depth: 0}), walk.make(funcs))

// console.log(funcs);
// console.log(walk.make(funcs));

// walk.simple attempt. Failed because we need the ancestors to place the braces.

// const BinaryHandler = (node) => {
//   if (outString) {
//     outString = node.operator + "(" + outString + ")";
//   } else {
//     outString = node.operator;
//   }
//   console.log(outString)
// }

// outString = "";
// walk.simple(acorn.parse(data, {ecmaVersion: 2020}), {
//     BinaryExpression(node) {
//       BinaryHandler(node)
//       // console.log(`Found a literal: ${node.operator}`)
//     }
//   });



