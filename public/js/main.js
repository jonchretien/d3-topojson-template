/**
 * @author Jon Chretien
 * @overview A geo data viz that shows different listening stats for one playlist over a 11 day period.
 */

requirejs.config({

  paths: {
    // appplication
    'map':             '../js/map',

    // tooltip
    'tooltip':             '../js/tooltip',

    // utilities
    'utils':           '../js/utils',

    // vendor
    'd3':              '../bower_components/d3/d3',
    'queue':           '../bower_components/queue-async/queue',
    'requirejs':       '../bower_components/requirejs/require',
    'template':        '../bower_components/microtemplates/index',
    'topojson':        '../bower_components/topojson/topojson'
  }
});

// handle async requests and map creation
require([
  'requirejs',
  'queue',
  'd3',
  'map'
], function(requirejs, queue, d3, Map) {
  'use strict';

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

});
