#! /usr/bin/env node

import yargs from "yargs/yargs"
import { walkRec } from "./visit"
import glob from "glob"
import fs from "fs"

const argv = yargs(process.argv.slice(2)).options({
  depth: { type: 'number' },
  inputDir: { type: 'string', demandOption: true },
  constants: { type: 'array'},
}).argv;

const directory = argv.inputDir + "/*.js";
glob(directory, (err: Error | null, files: string[]): void => {
  let result: {[pattern: string]: number} = {};
  if (err) {
    console.log(err);
  }
  files.forEach((file: string) => {
    result = (walkRec({ maxRecursionDepth: argv.depth, inputFile: file, constants: argv.constants }));
  })
  fs.writeFileSync("output.txt" ,JSON.stringify(result, null, 4));
  console.log("finished");
})




// console.log(JSON.stringify(result));





