/**
 * @author Jon Chretien
 * @overview A geo data viz that shows different listening stats for one playlist over a 11 day period.
 */
'use strict';

/**
 * Module dependencies.
 */
var d3 = require('../node_modules/d3/d3');
var Map = require('./components/map');
var queue = require('../node_modules/queue-async/queue');

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
