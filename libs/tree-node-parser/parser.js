"use strict";

let fs = require('fs');
let csv_parse = require('csv-parse');

module.exports = {};


module.exports.parse = (filename, callback) => {

  let nodes = new Set();
  let edges = {};
  let adjacencyList = {};

  let parser = csv_parse({delimiter: ',', columns: true, trim: true}, (err, data) => {
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

  parser.on('end', () => {
    callback(nodes, edges, adjacencyList);
    
  });
};


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

