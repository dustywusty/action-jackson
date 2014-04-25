var moment = require('moment')
  , mongoose = require('mongoose')
    //
  , config = require('./config.js');

// ------------------------------------------------------------------------------------
// Action schema
// ------------------------------------------------------------------------------------

var schema = new mongoose.Schema({
  actionData: {
    //Schema.Types.Mixed
  },
  actionPlugin: {
    required: true,
    type: String
  },
  interval: {
    default: config.actionIntervalDelay,
    type: Number
  },
  lastExecuted: {
    default: moment().valueOf(),
    type: Date
  },
  name: {
    required: true,
    type: String,
    unique: true
  }
});

// ------------------------------------------------------------------------------------
// Static methods
// ------------------------------------------------------------------------------------

/**
 * list all actions
 * @param callback
 */

schema.statics.findAll = function(callback) {
  this.find({}, callback);
};

/**
 * find action by name
 * @param actionName
 * @param callback
 */

schema.statics.findByName = function(actionName, callback) {
  this.findOne({name: actionName}, callback);
};

// ------------------------------------------------------------------------------------
// Register our model
// ------------------------------------------------------------------------------------

module.exports = mongoose.model('Action', schema);
