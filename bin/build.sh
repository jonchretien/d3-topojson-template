#!/bin/bash

# constants
BUILD_DIR='_dist'

# remove previous build directory
rm -rf $BUILD_DIR/

# make directories
mkdir $BUILD_DIR
mkdir $BUILD_DIR/css
mkdir $BUILD_DIR/js
mkdir $BUILD_DIR/data

# copy files
cp index.html $BUILD_DIR/index.html
cp css/bundle.css $BUILD_DIR/css/app.css
cp data/us-states-output.json $BUILD_DIR/data/us-states-output.json
cp data/data.json $BUILD_DIR/data/data.json
cp js/bundle.js $BUILD_DIR/js/bundle.js