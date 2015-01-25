#!/bin/bash

# constants
BUILD_DIR='_dist'

# remove previous build directory
rm -rf $BUILD_DIR/
echo "Removed old build directory."

# make directories
mkdir $BUILD_DIR
mkdir $BUILD_DIR/css
mkdir $BUILD_DIR/js
mkdir $BUILD_DIR/data
echo "Created new directories."

# copy files
cp index.html $BUILD_DIR/index.html
cp data/us-states-output.json $BUILD_DIR/data/us-states-output.json
cp data/data.json $BUILD_DIR/data/data.json
echo "Copied files."

# minify files
node-sass --output-style compressed -o $BUILD_DIR/css/ sass/main.scss bundle.css
uglifyjs js/bundle.js -o $BUILD_DIR/js/bundle.js
echo "Minified files."