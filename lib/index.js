var express = require('express')
  , app = express()
  , log = require('logule').init(module, 'action-jackson')
  , mongoose = require('mongoose')
  , util = require('util')
    //
  , config = require('./config.js');

// ------------------------------------------------------------------------------------
// Mongo
// ------------------------------------------------------------------------------------

var uri = util.format('mongodb://%s:%d/%s',
    config.mongo.host,
    config.mongo.port,
    config.mongo.db
  )
  , options = {
      db: {
        native_parser: true
      },
      replset: {
        socketOptions: {
          keepAlive: 1
        }
      },
      server: {
        poolSize: 10
      }
    };

mongoose.connection.on('connected', function () {
  log.info('mongoose connected to ' + uri);
});

mongoose.connection.on('error', function (error) {
  log.error('mongoose error: ' + error);
});

mongoose.connection.on('disconnected', function () {
  log.error('mongoose disconnected');
});

mongoose.connect(uri, options);

// ------------------------------------------------------------------------------------
// Express
// ------------------------------------------------------------------------------------

app.set('port', process.env.PORT || 3000);
app.use(function(req, res, next) {
  req.startDate = Date.now();
  next();
});
app.use(express.logger('dev')); //TODO: custom logger - dusty
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
// ------------------------------------------------------------------------------------
// Register routes
// ------------------------------------------------------------------------------------
app.use('/actions', require('./routes.js'));
// ------------------------------------------------------------------------------------
app.use(express.errorHandler());
app.use(function(req, res) {
  res.status(404);
  res.send({
    message: "Not Found"
  });
});

// ------------------------------------------------------------------------------------
// Load action actions and start interval timers
// ------------------------------------------------------------------------------------
require('./manager.js');

// ------------------------------------------------------------------------------------
// Hey, listen
// ------------------------------------------------------------------------------------

app.listen(app.get('port'), function() {
    log.info("listening on port %d", app.get('port'));
});

module.exports = app;