var express = require('express')
  , app = express()
  , log = require('logule').init(module, 'routes')
  , validate = require('paperwork')
    //
  , actionManager = require('./manager.js');

// ------------------------------------------------------------------------------------
// Action routes -- http://myserver/actions
// ------------------------------------------------------------------------------------

module.exports = (function() {
  'use strict';

  /**
   * /
   *
   * list all servers with status information
   */

  app.get('/', function(req, res) {
    actionManager.getAllActions(function(err, actions) {
      if (err) {
        log.error(err);
      }
      res.send({
        error: err,
        actions: actions
      });
    });
  });

  /**
   * /add
   *
   * add action
   */

  app.post('/add',
    validate.accept({
      actionData    : validate.optional(Object),
      actionPlugin  : String,
      name          : String
    }), function(req, res) {
      actionManager.addAction({
        actionData    : req.body.actionData,
        actionPlugin  : req.body.actionPlugin,
        name          : req.body.name
      }, function(err) {
        if (err) {
          res.send(500);
        } else {
          res.send(200);
        }
      });
    }
  );

  /**
   * /remove
   *
   * remove action
   */

  app.post('/remove',
    validate.accept({
      name          : String
    }), function(req, res) {
      actionManager.removeAction({
        name : req.body.name
      }, function(err) {
        if (err) {
          res.send(500);
        } else {
          res.send(200);
        }
      });
    }
  );

  return app;
}());
