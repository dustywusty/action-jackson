// ------------------------------------------------------------------------------------
// Base Action plugin
// ------------------------------------------------------------------------------------

var Action = function() {
  // ..
};

// ------------------------------------------------------------------------------------
// Required
// ------------------------------------------------------------------------------------

/**
 * All action actions are required to override Action.pluginName
 * @type {undefined}
 */

Action.prototype.actionName = undefined;

/**
 * All action actions are required to override Action.execute
 * @type {undefined}
 */

Action.prototype.execute = undefined;

// ..

module.exports = Action;