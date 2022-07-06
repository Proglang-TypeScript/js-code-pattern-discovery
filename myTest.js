const acorn = require("acorn")
const fs = require("fs")
const walk = require("acorn-walk")

let outString = "A";
let letterCount = 66;

const data = fs.readFileSync('myTestFile.ts', 'utf8');


const BinaryHandler = (node) => {
  if ((node.left.type == "BinaryExpression") || (node.right.type == "BinaryExpression")) {
    outString = outString + node.operator + "(" + String.fromCharCode(letterCount);
    letterCount += 1;
  } else {
    outString = outString + node.operator + String.fromCharCode(letterCount);
    letterCount += 1;
  }
  console.log(outString);
}

const funcs = {};
funcs.BinaryExpression = (node, st, c) => {
  const { depth } = JSON.parse(st)
  console.log(st)
  BinaryHandler(node);
  const updatedDepth = depth + 1;
  const updatedState = JSON.stringify({depth: updatedDepth});
  c(node.left, updatedState, "Expression")
  c(node.right, updatedState, "Expression")
};


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



