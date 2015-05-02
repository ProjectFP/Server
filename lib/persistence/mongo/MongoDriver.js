var mongoose = require('mongoose');
var blue = require('bluebird');

var config = require('../../../config').getConfig();

mongoose.connect(config.MONGO_CREDENTIALS);

var db = mongoose.connection;

db.on('error', function(e){
    console.log('Mongoose DB Connection Error: ',e);
});

db.on('open', function(e){
    console.log('Mongoose DB Connection Established.');
});

//TODO: separate handler and mongoose
