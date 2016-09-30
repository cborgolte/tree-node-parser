#!/usr/bin/env node

"use strict";

let argv = require('argv');
let parser = require('../libs/tree-node-parser/parser.js');

argv.option([
  {
    name: 'input',
    short: 'i',
    type: 'path',
    description: 'The path to the underlying tree node csv file.',
    example: "'script --input=fixtures/nodes.csv' or 'script -i fixtures/nodes.csv'"
  },
  {
    name: 'start-node',
    short: 's',
    type: 'string',
    description: 'The node from which to start collecting leaf nodes.',
    example: "'script --start-nodes=fruit' or 'script -s fruit'"
  },
  {
    required: true,  // XXX: Normally option parsers should support this flag!
    name: 'find-path-to',
    short: 'p',
    type: 'string',
    description: 'The node to find the path to, starting from the root node.',
    example: "'script --find-path-to=lemon' or 'script -p lemon'"
  },
  {
    name: 'nodes-with-n-children',
    short: 'n',
    type: 'int',
    description: 'Find all nodes with this amount of children'
  }
]);

let args = argv.run();
let options = args.options;

let filename = options['input'];
let nodename = options['find-path-to'];
let startNode = options['start-node'];
let amountOfChildren = options['nodes-with-n-children'];

function error(msg) {
  console.error(msg)
  process.exit(1)
}

if (![filename, nodename, startNode, amountOfChildren].every(v=> v !== undefined)) {
  argv.help();
  process.exit(9);
}

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

