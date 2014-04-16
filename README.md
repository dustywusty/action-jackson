# Action Jackson
* Starring CARL WEATHERS as Apollolo Creed

![Alt text](https://raw.githubusercontent.com/clarkda/repo-images/master/action-jackson.js/actionjackson.png "I aint got time to bleed")

# What?

Action Jackson executes `action plugins` on a specified interval

# API

* lists all actions
```
curl -i -X GET http://localhost:3000/actions/
```
* add a new action
```
curl -i -X POST http://localhost:3000/actions/add --data '{"actionPlugin":"PingGithub", "name":"ping-github"}' -H "Content-Type: application/json"
```
* removes a action

```
curl -i -X POST http://localhost:3000/actions/remove --data '{"name":"ping-github"}' -H "Content-Type: application/json"
```

# How?

* Action plugins must inherit from Action and
* Action plugins must override ::execute and ::actionName
* Place plugin definition into actions/ActionName/index.js
* At interval specified in config::pollIntervalDelay, action jackson will fetch registered actions, and ::execute each one

# Example

```
var Action = require('../../lib/plugin.js')
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
```

```
chunk:uptime dusty$ node index.js
17:38:19 - INFO  - action-jackson - action_manager - initializing
17:38:19 - INFO  - action-jackson - action_manager - loading actions
17:38:19 - INFO  - action-jackson - action_manager - .. DeployInfo
17:38:19 - INFO  - action-jackson - action_manager - .. MogFlicks
17:38:19 - INFO  - action-jackson - action_manager - .. PingGithub
17:38:19 - INFO  - action-jackson - listening on port 3000
17:38:19 - INFO  - action-jackson - mongoose connected to mongodb://localhost:27017/actionjackson
17:38:49 - INFO  - action-jackson - action_manager - deploy_info - 3.2.0.64
17:38:50 - INFO  - action-jackson - action_manager - mog_flicks - mog flicks is alive
17:38:51 - INFO  - action-jackson - action_manager - ping_github - host github.com is alive
```
