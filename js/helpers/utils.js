'use strict';

var Utils = {

  /**
   * Removes underscores from label names.
   *
   * @param {String} label - data label.
   * @returns {String}
   */
  createLabelText: function(label) {
    return label.replace(/_/g, ' ');
  },

  /**
   * Finds label names from data set.
   *
   * @param {Object} obj - Dates object from given state name in data set.
   */
  getLabelNames: function(obj) {
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        return Object.keys(obj[key]).sort();
      }
    }
  }

};

/**
 * Expose `Utils`.
 */
module.exports = Utils;
