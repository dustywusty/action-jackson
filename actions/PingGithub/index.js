var Action = require('../../lib/plugin.js')
  , log = require('logule').init(module, 'ping_github')
  , ping = require('ping')
  , util = require('util');

// ------------------------------------------------------------------------------------
// Ping Github.com example plugin
// ------------------------------------------------------------------------------------

var PingGithub = function() {
  this.actionName = 'PingGithub';
  // ..
};
util.inherits(PingGithub, Action);

/**
 * is github.com & pages.github.com up?
 */

PingGithub.prototype.execute = function() {
  var hosts = ['github.com', 'pages.github.com'];
  hosts.forEach(function(host) {
    ping.sys.probe(host, function(isAlive) {
      var msg = isAlive ? 'host ' + host + ' is alive' : 'host ' + host + ' is dead';
      log.info(msg);
    });
  });
};

module.exports = PingGithub;