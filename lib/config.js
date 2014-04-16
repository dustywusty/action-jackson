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
  actionIntervalDelay : 30000, //ms
  actionPluginPath : util.format('%s/../actions/', __dirname),
  pollIntervalDelay : 30000, //ms
  requestTimeout : 5000 //ms
};
