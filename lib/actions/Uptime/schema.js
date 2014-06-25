var mongoose = require('mongoose')
    //
  , config = require('./config.js');

// ------------------------------------------------------------------------------------
// Uptime schema
// ------------------------------------------------------------------------------------

var schema = new mongoose.Schema({
  lastChecked: {
    default: Date.now(),
    type: Number
  },
  statusCode: {
    required: true,
    type: String
  },
  uri: {
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

module.exports = mongoose.model('Uptime', schema);
