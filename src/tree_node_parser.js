#!/usr/bin/env node

"use strict";

let fs = require('fs');
let parse = require('csv-parse');


function error(msg) {
  console.error(msg)
  process.exit(1)
}

if (process.argv.length != 4) {
  error('usage: ' + process.argv[1] + ' {nodes.csv} {nodename}');
}

let filename = process.argv[2]
let nodename = process.argv[3]
let nodes = new Set();
let edges = {};
//let adjacencyList = new Proxy({}, {
//  get: (target, name) => target.hasOwnProperty(name) ? target[name] : []
//});
let adjacencyList = {};

let parser = parse({delimiter: ',', columns: true, trim: true}, (err, data) => {
  data.forEach( (edge, index, array) => {
    // collect nodes
    nodes.add(edge.name);
    // collect edges
    edges[edge.name] = edge.parent;
    // fill adjacency list
    adjacencyList[edge.parent] = adjacencyList[edge.parent] || [];
    adjacencyList[edge.parent].push(edge.name);
  });
});

fs.createReadStream(filename).pipe(parser);

function leafCollector(parentNode, collection, adjacencyList) {
  // { sweet: [ 'apple', 'banana', 'watermelon' ],
  // cheese: [ 'blue', 'yellow' ],
  // root: [ 'cheese', 'fruit' ],
  // sour: [ 'citrus', 'redcurrant' ],
  // blue: [ 'gorgonzola' ],
  // citrus: [ 'lemon', 'lime', 'orange' ],
  // yellow: [ 'parmesan', 'pecorino' ],
  // fruit: [ 'sour', 'sweet' ] }
  let children = adjacencyList[parentNode]
  if (children === undefined) {
    collection.push(parentNode);
  }
  else {
    children.forEach(node => leafCollector(node, collection, adjacencyList));
  }
  return collection;
}

parser.on('end', () => {
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
  let fruits = leafCollector('sour', [], adjacencyList);
  console.log(fruits);
});
