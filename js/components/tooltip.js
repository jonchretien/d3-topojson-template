'use strict';

/**
 * Module dependencies.
 */
var tmpl = require('microtemplates/index');

/**
 * @constructor
 *
 * @param {String} tooltip - Container for tooltip.
 * @param {String} template - JavaScript template.
 */
function Tooltip(tooltip, template) {
 this.tooltip = document.querySelector(tooltip);
 this.toolTipTemplate = tmpl(document.querySelector(template).innerHTML);
}

/**
 * Shows tooltip when user hovers over element.
 *
 * @param {Object} data - Data to display in JavaScript template.
 */
Tooltip.prototype.show = function(data) {
 this.tooltip.innerHTML = this.toolTipTemplate(data);

 // toggle visibility
 this.tooltip.classList.remove('hide');
};

/**
 * Hides tooltip when user moves mouse off of element.
 */
Tooltip.prototype.hide = function() {
 this.tooltip.classList.add('hide');
};

/**
 * Moves tooltip when user moves mouse.
 *
 * @param {Object} event - The event triggered.
 */
Tooltip.prototype.move = function(event) {
 this.tooltip.style.left = event.pageX + 5 + 'px';
 this.tooltip.style.top = event.pageY - (parseInt(this.tooltip.clientHeight, 10) - 60) + 'px';
};

/**
 * Expose `Tooltip`.
 */
module.exports = Tooltip;
