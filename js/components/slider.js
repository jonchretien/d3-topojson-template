'use strict';

/**
 * Range input type.
 * @constructor
 */
function Slider() {}

/**
 * Builds slider control.
 *
 * @param {Array} dates - Date range for data.
 * @param {Object} map - Map element.
 * @param {Object} shell - Shell element.
 */
Slider.prototype.build = function(dates, map, shell) {
  var range = document.createElement('input');
  range.setAttribute('id', 'js-slider');
  range.setAttribute('type', 'range');
  range.setAttribute('min', 0);
  range.setAttribute('max', dates.length - 1);
  range.setAttribute('step', 1);
  range.setAttribute('value', 0);
  shell.insertBefore(range, map);
};

/**
 * Expose `Slider`.
 */
module.exports = new Slider();
