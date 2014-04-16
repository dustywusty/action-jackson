var mongoose = require('mongoose')
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
  name: {
    required: true,
    type: String,
    unique: true
  },
  interval: {
    default: config.actionIntervalDelay,
    type: Number
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
}

/**
 * find action by name
 * @param actionName
 * @param callback
 */

schema.statics.findByName = function(actionName, callback) {
  console.log("findOne: " + actionName);
  this.findOne({name: actionName}, callback);
}

// ------------------------------------------------------------------------------------
// Register our model
// ------------------------------------------------------------------------------------

module.exports = mongoose.model('Action', schema);