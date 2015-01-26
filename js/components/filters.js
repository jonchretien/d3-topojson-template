'use strict';

/**
 * Module dependencies.
 */
var Utils = require('../helpers/utils');

/**
 * Map filters.
 *
 * @constructor
 */
function Filters() {}

/**
 * Builds map filters.
 *
 * @api public
 */
Filters.prototype.build = function(labels) {
  var fragment = document.createDocumentFragment();
  var filterContainer = document.querySelector('#js-filter-container');

  for (var i = 0, len = labels.length; i < len; i++) {
    var el = document.createElement('button');
    el.textContent = Utils.createLabelText(labels[i]);
    el.dataset.id = [i];
    el.dataset.label = labels[i];
    el.classList.add('btn');
    el.classList.add('btn-filter');
    fragment.appendChild(el);
  }

  // add to DOM
  filterContainer.appendChild(fragment);

  // add active class to current label
  filterContainer.querySelector('[data-label=' + labels[0] + ']').classList.add('active');
};

/**
 * Expose `Filters`.
 */
module.exports = new Filters();
