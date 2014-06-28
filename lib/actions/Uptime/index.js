var Action = require('../../plugin.js')
  , log = require('logule').init(module, 'uptime')
  , ping = require('ping')
  , util = require('util');

// ------------------------------------------------------------------------------------
// Uptime example plugin
// ------------------------------------------------------------------------------------

var Uptime = function(app) {
  this.actionName = 'Uptime';
  // ..
};
util.inherits(Uptime, Action);

/**
 * Uptime stub
 */

Uptime.prototype.execute = function() {
  //stub
};

module.exports = Uptime;
