'use strict';

/**
 * Module dependencies.
 */
var d3 = require('d3/d3');
var Filters = require('./filters');
var Keyboard = require('../helpers/keyboard');
var Slider = require('./slider');
var Tooltip = require('./tooltip');
var topojson = require('topojson/topojson');
var Utils = require('../helpers/utils');

/**
 * Map of the United States.
 *
 * @constructor
 * @param {Array} states - GeoJSON file of 50 US states and D.C.
 * @param {Array} data - Data set.
 */
function Map(us, data) {
  // declare variables
  this.us = us;
  this.currentLabel = 0;
  this.data = data;
  this.dates = Object.keys(this.data[0].dates).sort();
  this.firstDate = this.dates[0];
  this.labels = Utils.getLabelNames(this.data[0].dates);
  this.maxValue = this.getMaxOfArray();
  this.minValue = this.getMinOfArray();
  this.filters = null;
  this.slider = null;

  // constants
  this.COLOR_OFFSET = 90;

  // cache DOM elements
  this.currentDate = document.querySelector('#js-current-date');
  this.map = document.querySelector('#js-map');
  this.shell = document.querySelector('#js-shell');

  // display earliest date date
  this.currentDate.textContent = this.firstDate;
}

/**
 * Initializes application.
 *
 * @api public
 */
Map.prototype.init = function() {
  this.buildFilters();
  this.buildSlider();
  this.buildTooltip();
  this.buildMap();
  this.attachEventHandlers();
};

/**
 * Builds map filters.
 *
 * @api private
 */
Map.prototype.buildFilters = function() {
  Filters.build(this.labels);
  this.filters = document.querySelectorAll('.btn-filter');
};

/**
 * Builds slider control.
 *
 * @api private
 */
Map.prototype.buildSlider = function() {
  Slider.build(this.dates, this.map, this.shell);
  this.slider = document.querySelector('#js-slider');
};

/**
 * Builds tooltip.
 *
 * @api private
 */
Map.prototype.buildTooltip = function() {
  this.tooltip = new Tooltip('#js-tooltip', '#tooltip-template');
};

/**
 * Builds d3 map using topojson layer.
 *
 * @api private
 */
Map.prototype.buildMap = function() {
  var width = 960,
      height = 500,
      _this = this;

  // apply the Albers USA projection
  var projection = d3.geo.albersUsa()
      .scale(1070)
      .translate([width / 2, height / 2]);

  var path = d3.geo.path()
      .projection(projection);

  var svg = d3.select(this.map).append('svg')
      .attr('width', width)
      .attr('height', height);

  svg.append('rect')
      .attr('class', 'background')
      .attr('width', width)
      .attr('height', height);

  var g = svg.append('g');

  g.append('g')
      .attr('class', 'states')
    .selectAll('path')
      .data(topojson.feature(this.us, this.us.objects['us-states']).features)
    .enter().append('path')
      .attr('d', path)
      .attr('d', path).attr('data-name', function(d, i) {
        return _this.data[i].name;
      })
      .attr('d', path).attr('data-id', function(d, i) {
        return _this.data[i].id;
      })
      .data(this.data)
      .attr('fill', function(d) {
        return 'hsl(216, 86%, ' + (_this.COLOR_OFFSET - _this.getColorRange(d.dates['' + _this.firstDate + ''][_this.labels[_this.currentLabel]])) + '%)';
      });

  g.append('path')
      .datum(topojson.mesh(this.us, this.us.objects['us-states'], function(a, b) { return a !== b; }))
      .attr('id', 'js-state-borders')
      .attr('class', 'state-borders')
      .attr('d', path);
};

/**
 * Calculates the color range for the map using linear scales.
 * The input domain is the date with the least values and the date with the most values.
 * The scale's output range is from 0 to 100.
 *
 * @param {Number} data - The values for a certain label on a given date. Example: streams_gt_30 for all regions on 1/1/13.
 * @returns {Number}
 * @api private
 */
Map.prototype.getColorRange = function(data) {
  var color = d3.scale.linear().domain([this.minValue, this.maxValue]).range([0, 100]);

  return color(data);
};

/**
 * Finds the date with the lowest values.
 *
 * @returns {Number}
 * @api private
 */
Map.prototype.getMinOfArray = function() {
  var minValue = Math.min.apply(Math, this.data.map(function(filteredData) {
    return filteredData.dates[this.firstDate][this.labels[this.currentLabel]];
  }.bind(this)));

  return minValue;
};

/**
 * Finds the date with the highest values.
 *
 * @returns {Number}
 * @api private
 */
Map.prototype.getMaxOfArray = function() {
  var maxValue = Math.max.apply(Math, this.data.map(function(filteredData) {
    return filteredData.dates[this.firstDate][this.labels[this.currentLabel]];
  }.bind(this)));

  return maxValue;
};

/**
 * Attaches event handlers.
 *
 * @api private
 */
Map.prototype.attachEventHandlers = function() {
  var _this = this;

  // states
  [].forEach.call(document.querySelectorAll('[data-name]'), function(el) {
    el.addEventListener('mouseover', function(event) {
      _this.tooltip.show({
        data: _this.data[event.currentTarget.getAttribute('data-id')].dates['' + _this.dates[parseInt(_this.slider.value, 10)] + ''][_this.labels[_this.currentLabel]],
        label: Utils.createLabelText(_this.labels[_this.currentLabel]),
        state: event.currentTarget.getAttribute('data-name')
      });
    }, false);
    el.addEventListener('mousemove', function(event) {
      _this.tooltip.move(event);
    }, false);
    el.addEventListener('mouseout', function() {
      _this.tooltip.hide();
    }, false);
  });

  // filters
  [].forEach.call(this.filters, function(el) {
    el.addEventListener('click', _this.refresh.bind(_this), false);
  });

  // slider
  this.slider.addEventListener('change', this.updateMapValues.bind(this), false);

  // keyboard controls
  document.documentElement.addEventListener('keydown', this.keyboardNavigation.bind(this), false);
};

/**
 * Refreshes user interface.
 *
 * @param {Object} event - The event triggered.
 * @api private
 */
Map.prototype.refresh = function(event) {
  this.updateButtonState(event);
  this.maxValue = this.getMaxOfArray();
  this.minValue = this.getMinOfArray();
  this.updateMapValues();
};

/**
 * Updates map colors by shifting array values based on current slider value.
 * Also updates the current date displayed on the page.
 *
 * @api private
 */
Map.prototype.updateMapValues = function() {
  var index = parseInt(this.slider.value, 10),
      _this = this;

  // update date
  this.currentDate.textContent = this.dates[index];

  d3.selectAll('path')
    .data(this.data)
    .transition()
    .attr('fill', function(d) {
      return 'hsl(216, 86%, ' + (_this.COLOR_OFFSET - _this.getColorRange(d.dates['' + _this.dates[index] + ''][_this.labels[_this.currentLabel]])) + '%)';
  });
};


/**
 * Event handler that switches primary label for map and changes button highlight.
 *
 * @param {Object} event - The event triggered.
 * @api private
 */
Map.prototype.updateButtonState = function(event) {
  event.preventDefault();

  // remove '.active' class on all nav items
  [].forEach.call(this.filters, function(el) {
    el.classList.remove('active');
  });

  event.currentTarget.classList.add('active');

  // update current label id
  this.currentLabel = event.currentTarget.getAttribute('data-id');
};

/**
 * Code logic for right and left arrow keys.
 *
 * @param {Object} event - The event triggered.
 * @api private
 */
Map.prototype.keyboardNavigation = function(event) {
  if (event.keyCode === Keyboard.KEYS.ARROW_RIGHT) {
    event.preventDefault();

    // increase slider value by 1 if we're not at the end
    if (this.slider.value < this.dates.length - 1) {
      this.slider.value++;
      this.updateMapValues();
    }
  } else if (event.keyCode === Keyboard.KEYS.ARROW_LEFT) {
    event.preventDefault();

    // decrease slider value by 1 if we're not at the beginning
    if (this.slider.value >= 0) {
      this.slider.value--;
      this.updateMapValues();
    }
  }
};

/**
 * Expose `Map`.
 */
module.exports = Map;
