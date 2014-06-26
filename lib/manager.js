var _ = require('underscore')
  , fs = require('fs')
  , log = require('logule').init(module, 'action_manager')
  , moment = require('moment')
    //
  , actionPlugin = require('./plugin.js')
  , actionSchema = require('./schema.js')
  , app = require('./index.js')
  , config = require('./config.js');

// ------------------------------------------------------------------------------------
// Action manager
// ------------------------------------------------------------------------------------

var ActionManager = function() {
  this.actions = [];
  this.interval = undefined;
  // ..
  this.initialize();
};

/**
  * initialize
  */

ActionManager.prototype.initialize = function() {
  log.info('initializing');
  this._loadActionPlugins();
  this.startInterval();
};

// ------------------------------------------------------------------------------------
// Action plugin helpers - loadActionPlugins, validateActionPlugin, execute
// ------------------------------------------------------------------------------------

/**
 * load ../actions
 */

ActionManager.prototype._loadActionPlugins = function() {
  var path = config.actionPluginPath
    , self = this;

  log.info('loading actions');

  fs.readdirSync(path).forEach(function(file) {
    var actionPluginPath = path + file;

    if (!fs.lstatSync(actionPluginPath).isDirectory()) {
      log.error('Not a valid plugin! ' + actionPluginPath);
      return;
    }

    var Action = require(actionPluginPath + '/index.js')
      , instance = new Action(app);

    if (!self._validateActionPlugin(instance)) {
      return;
    }

    self.actions[instance.actionName] = instance;

    log.info('.. ' + instance.actionName);
  });
};

/**
 * validate action plugins inherit from Action
 * and are required to implement both actionName and execute
 *
 * @param actionInstance instance to validate
 * @return Boolean validates
 */

ActionManager.prototype._validateActionPlugin = function(actionInstance) {
  return (
    actionInstance instanceof actionPlugin
    && actionInstance.actionName !== undefined
    && actionInstance.execute !== undefined
  );
};

ActionManager.prototype._executeActionPlugin = function(action) {
  var actionName = action.actionPlugin;
  if (this.actions.hasOwnProperty(actionName)) {
    this.actions[actionName].execute(action.actionData);
  }
};

// ------------------------------------------------------------------------------------
// Interval helpers -- poll callback, startInterval, stopInterval
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
      if (moment().isAfter(moment(action.lastExecuted).add('milliseconds',action.interval))) {
        self._executeActionPlugin(action);
        // ..
        action.lastExecuted = moment().valueOf();
        action.save();
      }
    });
  });
};

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
};

/**
 * Stop heart beat
 */

ActionManager.prototype.stopInterval = function() {
  clearInterval(this.interval);
};

// ------------------------------------------------------------------------------------
// Route helpers -- getAllActions, addAction, removeAction
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
};

/**
 * Add an action
 * @param callback
 */

ActionManager.prototype.addAction = function(actionParams, callback) {

  console.log(actionParams);


  var action = new actionSchema({
    actionData: actionParams.actionData,
    actionPlugin: actionParams.actionPlugin,
    name: actionParams.name
  });

  action.save(function(err) {
    if (err) {
      log.error(err);
    }
    callback(err);
  });
};

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
};

// ------------------------------------------------------------------------------------
// Instance
// ------------------------------------------------------------------------------------

module.exports = (function() {
  var actionManger;
  if (typeof actionManger === 'undefined') {
      actionManger = new ActionManager();
  }
  return actionManger;
}());