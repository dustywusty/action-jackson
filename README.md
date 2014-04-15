# Action Jackson, starring carl weathers as apollolo creed

![Alt text](https://raw.githubusercontent.com/clarkda/repo-images/master/action-jackson.js/actionjackson.png "I aint got time to bleed")

# What?

Action Jackson executes plugins on a specified interval.

# API

http://localhost:port/actions/ - lists all registered actions
http://localhost:port/actions/add - registers a new action

`
curl -i -X POST http://localhost:3000/actions/add --data '{"actionPlugin":"PingGithub", "name":"ping-github"}' -H "Content-Type: application/json"
`

# How?

1. Action plugins must inherit from Action and
2. Action plugins must override ::execute and ::actionName
3. Put plugin def into actions/<ActionName>/index.js
4. At interval specified in config::pollIntervalDelay, action jackson will fetch registered actions, and ::execute each one

# Example

`
var Action = require('../../lib/action.js')
  , log = require('logule').init(module, 'ping_github')
  , ping = require("ping")
  , util = require('util');

/**
 *
 * @constructor
 */

var PingGithub = function() {
  this.actionName = 'PingGithub';
  // ..
}
util.inherits(PingGithub, Action);

/**
 * is github.com up?
 */

PingGithub.prototype.execute = function() {
  var hosts = ['github.com'];
  hosts.forEach(function(host){
    ping.sys.probe(host, function(isAlive){
      var msg = isAlive ? 'host ' + host + ' is alive' : 'host ' + host + ' is dead';
      log.info(msg);
    });
  });
}

// ..

module.exports = PingGithub
`

# Todo
* Each action should have it's own interval
* Maybe should include parameters per action. ex. so a single ping action could be used for X hosts