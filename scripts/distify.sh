#!/bin/sh

NODE_MODULES_BIN_PATH=`pwd`/node_modules/.bin

rm -r dist
mkdir -p dist

$NODE_MODULES_BIN_PATH/babel lib/index.js -o dist/index.min.js

$NODE_MODULES_BIN_PATH/browserify dist/index.min.js -o dist/index.min.js

$NODE_MODULES_BIN_PATH/uglifyjs dist/index.min.js -o dist/index.min.js
