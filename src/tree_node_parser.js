#!/usr/bin/env node

"use strict";

let parser = require('../libs/tree-node-parser/parser.js');


function error(msg) {
  console.error(msg)
  process.exit(1)
}

if (process.argv.length != 4) {
  error('usage: ' + process.argv[1] + ' {nodes.csv} {nodename}');
}

let filename = process.argv[2]
let nodename = process.argv[3]


function callback(nodes, edges, adjacencyList) {
    // guard: make sure, given nodename exists
    if (!nodes.has(nodename)) {
      error('Given node "' + nodename + '" does not exist.')
    }

    // calculate path to the given node
    let runner = nodename;
    let pathSegments = [];
    while (runner !== 'root') {
      pathSegments.unshift(runner);
      runner = edges[runner];
    }
    pathSegments.unshift('');
    let path = pathSegments.join('/');

    // find nodes w/ exactly two children
    let nodesWithTwoChildren = Object.keys(adjacencyList)
      .filter(key => adjacencyList[key].length === 2);
    console.log(nodesWithTwoChildren);

    // find leaf odes for fruits
    let fruits = parser.leafCollector('sour', [], adjacencyList);
    console.log(fruits);
}

let parserResults = parser.parse(filename, callback);

