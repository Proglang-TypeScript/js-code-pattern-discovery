# js-code-pattern-discovery

A tool to discover the existing code patterns in any given JS Files or Libraries.

## Install

```bash
$ git clone [THIS-REPO] dts-pattern-search
$ cd dts-pattern-search
$ npm i
```

## Usage

### Get the code patterns from a JS File or Library

This command will parse the files with acorn and walk the resulting AST with acorn-walk. The found patterns will be sorted by Frequency and written into "output.csv".

#### Analysing JS code

Give a glob expression representing a Library as input for the command. 

```bash
$ npm run pattern-search -- --inputDir [JS-DIR]
```

#### Example

```bash
$ npm run pattern-search -- --inputDir "examples/*.js"
```

#### Options

"inputIsFile" is false by default and can be set as true, if you want to analyse a single JS-file.
"depth" is the maximum depth of a single pattern.
"constants" is an array of values that you want to return as part of the result when they are found in a pattern.
"commutative" contains the operators for which the patterns will be simplified.