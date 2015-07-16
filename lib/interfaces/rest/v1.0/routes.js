var jwToken        = require('jsonwebtoken');

var UploadHandler  = require('../../../handlers/uploadHandler');
var ReceiptHandler = require('../../../handlers/receiptHandler');
var UserHandler    = require('../../../handlers/userHandler');

uploadHandler = new UploadHandler.UploadHandler();
receiptHandler = new ReceiptHandler.ReceiptHandler();
userHandler = new UserHandler.UserHandler();

var connectRoutes = function(expressApp) {
    // image processing send a image
    // return output the number
    expressApp.post('/upload', function (req, res) {
        //TODO: create an interface to handle response msg
        uploadHandler.filterImage(req,res);
    });

    //add the confirmed number to the data base
    //return saved for failed
    expressApp.post('/receipt', function (req, res) {
        receiptHandler.saveReceipt(req, res);
    });

    //accounts data
    expressApp.get('/account', function (req, res) {
        res.send(404, 'bad route');
    });

    //authenticate token from client
    //return JWT
    expressApp.post('/login', function (req, res) {
        var token = jwToken.sign({
            user: 'testUserName'
        }, expressApp.get('superSecret'), {
            expiresInMinutes: 1440 // expires in 24 hours
        });

        // return the information including token as JSON
        res.json({
            success: true,
            message: 'Here is JWT token!',
            token: token
        });
  
    });

    expressApp.post('/test', function (req, res) {
        // return the information including token as JSON
        res.json({
            success: true,
            message: 'Accessed API endpoint---update',
        });
  
    });

    expressApp.get('/', function (req, res) {
        var form = '<form action="/upload" enctype="multipart/form-data" method="post">Add a title:' + 
                        '<input name="title" type="text" />' +
                        '<br><br><input multiple="multiple" name="upload" type="file" />' +
                            '<br><br><input type="submit" value="Upload" />' +
                    '</form>' +
                    '<form action="/receipt" enctype="application/json" method="post">' + 
                        'confirm data:<input name="receipt" type="text" /><br>' +
                        'email:<input name="email" type="text" /><br>' +
                        'year.month:<input name="period" type="text" /><br>' +
                            '<br><input type="submit" value="Upload" />' +
                    '</form>' +
                    '<form action="/addUser" enctype="application/json" method="post">' + 
                        'email:<input name="email" type="text" /><br>' +
                        'name:<input name="name" type="text" />' +
                            '<br><br><input type="submit" value="Upload" />' +
                    '</form>';
        res.writeHead(200, {'Content-Type': 'text/html' });
        res.end(form); 
    });

    expressApp.post('/addUser', function (req, res) {
        userHandler.saveUser(req, res);
    });

    expressApp.all('*', function (req, res) {
        res.send(404, 'bad route');
    });
};


exports.connectRoutes = connectRoutes;