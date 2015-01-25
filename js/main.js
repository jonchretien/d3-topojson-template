/*!
 * D3 TopoJSON Template
 * Template that maps a data set to a SVG rendered map of the US.
 * Also has top level filters, tooltips per state, and a slider to navigate the date range.
 *
 * @license Released under the MIT license.
 * @copyright 2015 Jon Chretien
 */

'use strict';

/**
 * Module dependencies.
 */
var d3 = require('d3/d3');
var Map = require('./components/map');
var queue = require('queue-async/queue');

// fetch data
queue()
  .defer(d3.json, 'data/us-states-output.json') // topojson polygons
  .defer(d3.json, 'data/data.json') // sample data set
  .await(ready);

function ready(error, states, data) {
  if (error) {
    return console.warn(error);
  } else {
    var map = new Map(states, data);
  }
}
