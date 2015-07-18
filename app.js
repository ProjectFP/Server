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
var expressJwt = require('express-jwt');
var fs         = require('fs');
var morgan     = require('morgan');
// var publicKey  = fs.readFileSync('./public.pub');
var publicKey = "abcd";


var app = express();
app.use(morgan('dev'));
app.use(cors());
app.use(qt.static(__dirname + '/'));
// app.use(bodyParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set('superSecret', publicKey);

app.use(expressJwt({ 
    secret: publicKey
}).unless({path: ['/login', '/signup']})); 

routes.connectRoutes(app);

//set port to 3000
app.set('port', process.env.PORT || 3000);

// listen at port and log port #
var server = app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + server.address().port);
});
