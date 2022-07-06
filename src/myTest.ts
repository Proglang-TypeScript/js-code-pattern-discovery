import * as acorn from "acorn"
import fs from "fs"
import * as walk from "acorn-walk"

let outString = "A";
let letterCount = 66;
const recursionDepth = 4;

const data = fs.readFileSync('myTestFile.ts', 'utf8');


// walk.ancestor(acorn.parse(data, {ecmaVersion: 2020}), {
//   BinaryExpression(node, ancestors) {
//     console.log(node.operator, ancestors.map(n => n.type))
//   }
// })

const BinaryHandler = (node: any) => {
  if ((node.left.type == "BinaryExpression") || (node.right.type == "BinaryExpression")) {
    outString = outString + node.operator + "(";
  } else {
    outString = outString + node.operator;
  }
  console.log(outString);
}


const funcs: walk.RecursiveVisitors<string> = {BinaryExpression: (node, st, c) => {
  const binaryExpressionNode = node as any
  // console.log(depth)
  const { depth } = JSON.parse(st)
  console.log(st)
  BinaryHandler(binaryExpressionNode);
  const updatedDepth = depth + 1;
  const updatedState = JSON.stringify({depth: updatedDepth});
  c(binaryExpressionNode.left, updatedState)
  c(binaryExpressionNode.right, updatedState)
}};


// funcs.BinaryExpression = (node, st, c, depth) => {
//   console.log(depth)
//   BinaryHandler(node);
//   c(node.left, st, "Expression", depth - 1)
//   c(node.right, st, "Expression", depth - 1)
// };
// funcs.Program = (node, st, c, depth) => {
//   for (let stmt of node.body)
//     c(stmt, st, "Statement", recursionDepth)
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

walk.recursive(acorn.parse(data, {ecmaVersion: 2020}), JSON.stringify({}), walk.make(funcs))

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



