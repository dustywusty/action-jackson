var express = require('express')
  , app     = express()
  , log     = require('logule').init(module, 'action-jackson')
    //
  , config  = require('./config.js');

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
    message: 'Not Found'
  });
});

// ..

app.listen(app.get('port'), function() {
    log.info('listening on port %d', app.get('port'));
});

module.exports = app;

console.log(app);