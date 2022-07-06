import * as acorn from "acorn"
import fs from "fs"
import * as walk from "acorn-walk"

let outString = "";
let setLetterCount = 65;
let letterCount = setLetterCount;
const maxDepth = 0;
const maxRecursionDepth = 3;
const supported: Array<string> = ["BinaryExpression", "Program"]

const data = fs.readFileSync('myTestFile.ts', 'utf8');



const BinaryHandler = (node: any, recursionDepth: number): string => {
  if ((recursionDepth >= maxRecursionDepth) || ((node.left.type != "BinaryExpression") && node.right.type != "BinaryExpression") ) {
    letterCount += 2;
    return "(" + String.fromCharCode(letterCount-2) + node.operator + String.fromCharCode(letterCount-1) + ")";

  } else {
    if (((supported.indexOf(node.left.type) != -1)) && (supported.indexOf(node.right.type) == -1)) {
      letterCount += 1;
      return "(" + String.fromCharCode(letterCount - 1) + node.operator + BinaryHandler(node.left, recursionDepth + 1) + ")"
    }

    if (((supported.indexOf(node.left.type) == -1)) && (supported.indexOf(node.right.type) != -1)) {
      letterCount += 1;
      return "(" + String.fromCharCode(letterCount - 1) + node.operator + BinaryHandler(node.right, recursionDepth + 1) + ")"
    }

    if (((supported.indexOf(node.left.type) != -1)) && (supported.indexOf(node.right.type) != -1)) {
      letterCount += 1;
      return "(" + BinaryHandler(node.left, recursionDepth + 1) + node.operator + BinaryHandler(node.right, recursionDepth + 1) + ")"
    }
  }

  return "error: case not caught"

}


const funcs: walk.RecursiveVisitors<string> = {BinaryExpression: (node, st, c) => {
  const binaryExpressionNode = node as any
  const { depth } = JSON.parse(st)
  if (depth <= maxDepth) {
    letterCount = setLetterCount
    console.log(BinaryHandler(binaryExpressionNode, 0));
    const updatedDepth = depth + 1;
    const updatedState = JSON.stringify({ depth: updatedDepth });
    c(binaryExpressionNode.left, updatedState)
    c(binaryExpressionNode.right, updatedState)
  }
}
};



walk.recursive(acorn.parse(data, {ecmaVersion: 2020}), JSON.stringify({depth: 0}), walk.make(funcs))




