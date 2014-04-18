### Action Jackson

![Alt text](https://raw.githubusercontent.com/clarkda/repo-images/master/action-jackson.js/actionjackson.png "Starring CARL WEATHERS as Apollolo Creed")

## What is this?

Action Jackson executes `action plugins` on a specified intervals

### API

#### lists all actions

```
curl -i -X GET http://localhost:3000/actions/
```
#### add a new action

```
curl -i -X POST http://localhost:3000/actions/add --data '{"actionPlugin":"PingGithub", "name":"ping-github"}' -H "Content-Type: application/json"
```

#### remove a action

```
curl -i -X POST http://localhost:3000/actions/remove --data '{"name":"ping-github"}' -H "Content-Type: application/json"
```

## I want to make a plugin!

* Action plugins must inherit from `Action`
* And they must override `execute` and `actionName`
* Define your action plugin in ./actions/ActionPluginName/index.js
* Restart the app

### PingGithub Example Plugin

```javascript
var Action = require('../../lib/plugin.js')
  , log = require('logule').init(module, 'ping_github')
  , ping = require("ping")
  , util = require('util');

// ------------------------------------------------------------------------------------
// Ping Github.com example plugin
// ------------------------------------------------------------------------------------

var PingGithub = function() {
  this.actionName = 'PingGithub';
  // ..
}
util.inherits(PingGithub, Action);

/**
 * is github.com & pages.github.com up?
 */

PingGithub.prototype.execute = function() {
  var hosts = ['github.com', 'pages.github.com'];
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
chunk:action-jackson dusty$ node index.js
18:13:49 - INFO  - action-jackson - action_manager - initializing
18:13:49 - INFO  - action-jackson - action_manager - loading actions
18:13:49 - INFO  - action-jackson - action_manager - .. DeployInfo
18:13:49 - INFO  - action-jackson - action_manager - .. MogFlicks
18:13:49 - INFO  - action-jackson - action_manager - .. PingGithub
18:13:49 - INFO  - action-jackson - listening on port 3000
18:13:49 - INFO  - action-jackson - mongoose connected to mongodb://localhost:27017/actionjackson
18:14:19 - INFO  - action-jackson - action_manager - deploy_info - 3.2.0.64
18:14:19 - INFO  - action-jackson - action_manager - mog_flicks - mog flicks is alive
18:14:19 - INFO  - action-jackson - action_manager - ping_github - host github.com is alive
18:14:19 - INFO  - action-jackson - action_manager - ping_github - host pages.github.com is alive
```

## Contributing

Feel free to suggest any changes or bury me in pull requests!
