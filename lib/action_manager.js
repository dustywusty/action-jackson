// ====================================================================================
// Action schema
// ====================================================================================

var mongoose = require('mongoose');

var schema = new mongoose.Schema({
  actionData: {
    //Schema.Types.Mixed
  },
  actionPlugin: {
    required: true,
    type: String
  },
  name: {
    required: true,
    type: String,
    unique: true
  }
});

/**
 * list all actions
 * @param callback
 */

schema.statics.findAll = function(callback) {
  this.find({}, callback);
}

mongoose.model('Action', schema);

// ====================================================================================
// Action manager
// ====================================================================================

var _ = require('underscore')
  , events = require('events')
  , fs = require('fs')
  , log = require('logule').init(module, 'action_manager')
  , util = require('util')
  , validate = require('paperwork')
  // ..
  , actionPlugin = require('./action.js')
  , actionSchema = mongoose.model('Action')
  , config = require('./config.js');

/**
 * action manager
 * @constructor
 */

ActionManager = function(app) {
  this.actions = [];
  this.app = app;
  this.interval = undefined;
  // ..
  this.init();
}
//util.inherits(ActionManager, events.EventEmitter);

// Action helpers - init, load, add, remove, validate
// ------------------------------------------------------------------------------------

/**
 * init
 */

ActionManager.prototype.init = function() {
  log.info("initializing");
  this.buildRoutes();
  this.load();
  this.startInterval();
}

/**
 * load ../actions
 */

ActionManager.prototype.load = function() {
  var path = config.actionPluginPath;
  var self = this;

  log.info("loading actions");

  fs.readdirSync(path).forEach(function(file) {
    var actionPath = path + file;

    if (!fs.lstatSync(actionPath).isDirectory()) {
      log.error("Not a valid plugin! " + pluginPath);
      return;
    }

    var action = require(actionPath + "/index.js")
      , instance = new action();

    if (!self.validateAction(instance)) {
      return;
    }

    self.actions[instance.actionName] = instance;

    log.info(".. " + instance.actionName);
  });
};

/**
 * validate action plugins inherit from Action
 * and are required to implement both actionName and execute
 *
 * @param actionInstance instance to validate
 * @return Boolean validates
 */

ActionManager.prototype.validateAction = function(actionInstance) {
  return (
    actionInstance instanceof actionPlugin
    && actionInstance.actionName != undefined
    && actionInstance.execute != undefined
  );
}

// Interval callback
// ------------------------------------------------------------------------------------

/**
 * Polling callback
 */

ActionManager.prototype.poll = function() {
  var self = this;
  actionSchema.findAll(function(err, actions) {
    if (err) {
      log.error(err);
      return;
    }
    _.each(actions, function(action) {
      self._execute(action);
    });
  });
}

ActionManager.prototype._execute = function(action) {
  var actionName = action.actionPlugin;
  if (this.actions.hasOwnProperty(actionName)) {
    this.actions[actionName].execute();
  }
}

// Interval helpers - poll start & stop
// ------------------------------------------------------------------------------------

/**
 * Start interval heart beat
 */

ActionManager.prototype.startInterval = function() {
  var self = this;
  this.interval = setInterval(function() {
      self.poll();
    },
    config.pollIntervalDelay
  );
}

/**
 * Stop heart beat
 */

ActionManager.prototype.stopInterval = function() {
  clearInterval(this.interval);
}

// Action routes
// ------------------------------------------------------------------------------------

/**
 * setup our /actions routes and handlers
 */

ActionManager.prototype.buildRoutes = function() {
  var self = this;

  /**
   * /actions
   *
   * list all servers with status information
   */

  this.app.get('/actions', function(req, res) {
    self.getAllActions(function(err, actions) {
      if (err) {
        log.error(err);
      }
      res.send({
        error: err,
        actions: actions
      })
    });
  });

  /**
   * /actions/add
   *
   * add action
   */

  this.app.post('/actions/add',
    validate.accept({
      actionPlugin  : String,
      name          : String
    }),function(req, res) {
      self.addAction({
        actionPlugin  : req.body.actionPlugin,
        name          : req.body.name
      }, function(err) {
        if (err) {
          res.send(500);
        } else {
          res.send(200);
        }
      })
    }
  );
}

/**
 * Fetch all actions
 * @param callback
 */

ActionManager.prototype.getAllActions = function(callback) {
  actionSchema.findAll(function(err, actions) {
    if (err) {
      log.error(err);
    }
    callback(err, actions);
  });
}

/**
 * Add an action
 * @param callback
 */

ActionManager.prototype.addAction = function(action, callback) {
  var action = new actionSchema({
    actionPlugin: action.actionPlugin,
    name: action.name
  });

  action.save(function(err) {
    if (err) {
      log.error(err);
    }
    callback(err);
  });
}

// ====================================================================================
// ..
// ====================================================================================

module.exports = (function(app) {
  var actionManger;
  if (typeof actionManger == 'undefined') {
      actionManger = new ActionManager(app);
  }
  return actionManger;
});
