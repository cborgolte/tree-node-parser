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
  console.log('Path to node "' + nodename + '": ' + path);

  // find nodes w/ exactly two children
  let amountOfChildren = 2;
  let nodesWithTwoChildren = Object.keys(adjacencyList)
    .filter(key => adjacencyList[key].length === amountOfChildren);
  console.log('All nodes with ' + amountOfChildren + ' children: ' + nodesWithTwoChildren.join(', '));

  // find leaf nodes for fruits starting at 'fruit' node
  let startNode = 'fruit';
  let fruits = parser.leafCollector(startNode, [], adjacencyList);
  console.log('All leaf nodes starting from node "' + startNode + '": ' + fruits.join(', '));
}

let parserResults = parser.parse(filename, callback);

