import acorn from "acorn"
import fs from "fs"
import walk from "acorn-walk"
import { BinaryExpression } from "typescript";

let outString = "";

try{
    var data = fs.readFileSync('myTestFile.js', 'utf8');
} catch (err) {
    console.error(err);
};


const BinaryHandler = (node) => {
  if ((node.left.type == "BinaryExpression") || (node.right.type == "BinaryExpression")) {
    outString = outString + node.operator + "(";
  } else {
    outString = outString + node.operator;
  }
  console.log(outString);
}


let funcs: walk.RecursiveVisitors<string> = {};

funcs.BinaryExpression = (node: any, st, c) => {
  BinaryHandler(node);
  // const binaryExpressionNode = node;
  c(node.left, st)
  c(node.right, st)
};
// funcs.Program = (node, st, c, depth) => {
//   for (let stmt of node.body)
//     c(stmt, st, "Statement")
// };

walk.recursive(acorn.parse(data, {ecmaVersion: 2020}), "", walk.make(funcs))

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



