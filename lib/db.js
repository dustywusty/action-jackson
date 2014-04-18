var log = require('logule').init(module, 'action-jackson')
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
      /*jshint camelcase: false */
      native_parser: true
      /*jshint camelcase: true */
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