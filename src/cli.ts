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


glob(argv.inputDir, (err: Error | null, files: string[]): void => {
  let result: { [pattern: string]: number } = {};
  let errorCount = 0;
  if (err) {
    console.log(err);
  }
  files.forEach((file: string) => {
    [result, errorCount] = (walkRec({ maxRecursionDepth: argv.depth, inputFile: file, constants: argv.constants }));
  })
  const resultArray = Object.entries(result);
  const sortedResultArray = resultArray.sort(([, a], [, b]) => b - a);
  const sortedResult = Object.fromEntries(sortedResultArray);
  let patternCount = 0;
  let uniquePatternCount = 0;
  for (let x in sortedResultArray) {
    patternCount += sortedResultArray[x][1];
    uniquePatternCount += 1;
  }
  const outstring = "Found " + patternCount + " patterns and " + uniquePatternCount + " unique patterns, " + errorCount + " files could not be parsed:\n";
  fs.writeFileSync("output.txt", outstring + JSON.stringify(sortedResult, null, 4));
})
