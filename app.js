// // require app-config file for the server
// var app = require('./lib/routes.js');

// //set port to 3000
// app.set('port', process.env.PORT || 3000);

// // listen at port and log port #
// var server = app.listen(app.get('port'), function() {
//   console.log('Express server listening on port ' + server.address().port);
// });


var express    = require('express'); // require express server
var cors       = require('cors');
var routes     = require('./lib/interfaces/rest/v1.0/routes');
var qt         = require('quickthumb');
var bodyParser = require('body-parser');

var app = express();
app.use(cors());
app.use(qt.static(__dirname + '/'));
app.use(bodyParser());

routes.connectRoutes(app);

//set port to 3000
app.set('port', process.env.PORT || 3000);

// listen at port and log port #
var server = app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + server.address().port);
});
