var _ = require('underscore')
  , fs = require('fs')
  , log = require('logule').init(module, 'action_manager')
  , mongoose = require('mongoose')
    //
  , actionPlugin = require('./plugin.js')
  , actionSchema = require('./schema.js')
  , config = require('./config.js');

// ------------------------------------------------------------------------------------
// Action manager
// ------------------------------------------------------------------------------------

ActionManager = function() {
  this.actions = [];
  this.interval = undefined;
  // ..
  this.init();
}

// ------------------------------------------------------------------------------------
// Plugin helpers - init, load, add, remove, validate
// ------------------------------------------------------------------------------------

/**
 * init
 */

ActionManager.prototype.init = function() {
  log.info("initializing");
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

// ------------------------------------------------------------------------------------
// Interval helpers -- callback, startInterval, stopInterval
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

// ------------------------------------------------------------------------------------
// Action helpers -- getAllActions, addAction, removeAction
// ------------------------------------------------------------------------------------

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

/**
 * Remove an action
 * @param callback
 */

ActionManager.prototype.removeAction = function(action, callback) {
  actionSchema.findByName(action.name
    , function(err, action) {
      if (err) {
        log.error(err);
      } else {
        console.log(action);
        action.remove();
      }
      callback(err);
  });
}

// ------------------------------------------------------------------------------------
// Exports
// ------------------------------------------------------------------------------------

module.exports = (function() {
  var actionManger;
  if (typeof actionManger == 'undefined') {
      actionManger = new ActionManager();
  }
  return actionManger;
})();