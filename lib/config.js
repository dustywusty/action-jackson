var util = require('util');

module.exports = {
  http : {
    port  : 5000
  },
  mongo : {
    db    : 'actionjackson',
    host  : 'localhost',
    port  : 27017
  },
  ws : {
    port  : 5001
  },
  actionIntervalDelay : 60000, //ms
  actionPluginPath : util.format('%s/actions/', __dirname),
  pollIntervalDelay : 1000,
  requestTimeout : 5000 //ms
};