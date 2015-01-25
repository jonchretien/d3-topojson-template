#!/usr/bin/env node

'use strict';

/**
 * Module dependencies.
 */
var express = require('express');

/**
 * Initialize variables.
 */
var app = express();
var PORT = 8000;

/**
 * Serve static files.
 */
app.use(express.static(__dirname));
app.listen(process.env.PORT || PORT);

console.log('Server running at http://127.0.0.1:' + PORT + '/');
