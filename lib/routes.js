var express   = require('express'); // require express server
var qt         = require('quickthumb');
var upload    = require('./upload.js');
var path        = require('path');
var morgan      = require('morgan');
var bodyParser  = require('body-parser');
var app = express();

app.use(morgan('dev'));
app.use(bodyParser.json({limit : '50mb'}));

app.use(qt.static(__dirname + '/'));

// allow CORS and set options
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
};


app.use(express.static(__dirname+'/../public/'));

// temp html to upload image
var form = '<form action="/upload" enctype="multipart/form-data" method="post">Add a title:' + 
                '<input name="title" type="text" />' +
                '<br><br><input multiple="multiple" name="upload" type="file" />' +
                '<br><br><input type="submit" value="Upload" />' +
          '</form>';


app.get('/', function (req, res){
  res.writeHead(200, {'Content-Type': 'text/html' });
  res.end(form); 
}); 

app.get('/filters', handleFiltersRoute);

app.post('/upload', upload.upload);
app.post('/upload2', upload.upload2);

// requesting a route that doesn't exist
app.all('*', function (req, res) {
  res.send(404, 'bad route');
});

module.exports = app;

function handleFiltersRoute (req, res){
  var indexPath = path.resolve(__dirname,'./../public/index.html');

  res.sendfile(indexPath);
}