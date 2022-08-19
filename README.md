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

This command will parse the files with acorn and walk the resulting AST with acorn-walk. The found patterns will be sorted by Frequency and written into "output.txt".

#### Analysing JS code

Give the Library as input for the command and set "inputIsFile = true" if it is a single file. 

```bash
$ npm run pattern-search -- --inputDir [JS-FILE]
```

#### Example

(B):

```bash
$ npm run pattern-search -- --inputDir "examples/*.js"
```

#### Options

"inputIsFile" is false by default and can be set as true, if you want to analyse a single JS-file.
"depth" is the maximum depth of a single pattern.
"constants" is an array of values that you want to return as part of the result when they are found in a pattern.