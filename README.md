# Installation

npm install

# Example usage

```
$ bin/tree_node_parser.js -i fixtures/nodes.csv -s fruit -p lemon -n 2
```

## Result:

Path to node "lemon": /fruit/sour/citrus/lemon

All nodes with 2 children: cheese, root, sour, yellow, fruit

All leaf nodes starting from node "fruit": lemon, lime, orange, redcurrant, apple, banana, watermelon
