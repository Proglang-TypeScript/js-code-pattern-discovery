#! /usr/bin/env node

import yargs from "yargs/yargs"
import { walkRec } from "./visit"

const argv = yargs(process.argv.slice(2)).options({
  depth: { type: 'number' },
  inputFile: { type: 'string', demandOption: true },
  constants: { type: 'array'},
}).argv;

const result = (walkRec({ maxRecursionDepth: argv.depth, inputFile: argv.inputFile, constants: argv.constants }));
console.log((result));
// console.log(JSON.stringify(result));





