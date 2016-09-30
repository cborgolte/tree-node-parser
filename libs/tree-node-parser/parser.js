"use strict";

let fs = require('fs');
let csv_parse = require('csv-parse'); // never ever write your own csv parser!

// parse a tree-node csv file, collect nodes, edges and adjacencies
// Expected signature of callback function:
// callback(nodes, edges, adjacencyList)
module.exports.parse = (filename, callback) => {

  let nodes = new Set();
  let edges = {};
  let adjacencyList = {};

  let csvParser = csv_parse({delimiter: ',', columns: true, trim: true}, (err, data) => {
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

  fs.createReadStream(filename).pipe(csvParser);

  csvParser.on('end', () => {
    callback(nodes, edges, adjacencyList);
  });
};

// collect all leaf nodes of a graph given by `adjacencyList` starting
// from node `parentNode`.
// Results are collected in provided `collection` array
function leafCollector(parentNode, collection, adjacencyList) {
  let children = adjacencyList[parentNode]
  if (children === undefined) {
    collection.push(parentNode);
  }
  else {
    children.forEach(node => leafCollector(node, collection, adjacencyList));
  }
  return collection;
}
module.exports.leafCollector = leafCollector;
