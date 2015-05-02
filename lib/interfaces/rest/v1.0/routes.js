
var UploadHandler = require('../../../handlers/uploadHandler');
var ReceiptHandler = require('../../../handlers/receiptHandler');

uploadHandler = new UploadHandler.UploadHandler();
receiptHandler = new ReceiptHandler.ReceiptHandler();

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
    expressApp.post('/auth', function (req, res) {
        res.send(404, 'bad route');
    });

    expressApp.get('/', function (req, res) {
        var form = '<form action="/upload" enctype="multipart/form-data" method="post">Add a title:' + 
                        '<input name="title" type="text" />' +
                        '<br><br><input multiple="multiple" name="upload" type="file" />' +
                            '<br><br><input type="submit" value="Upload" />' +
                    '</form>' +
                    '<form action="/receipt" enctype="application/json" method="post">confirm data:' + 
                        '<input name="receipt" type="text" />' +
                            '<br><br><input type="submit" value="Upload" />' +
                    '</form>';
        res.writeHead(200, {'Content-Type': 'text/html' });
        res.end(form); 
    });

    expressApp.all('*', function (req, res) {
        res.send(404, 'bad route');
    });
};


exports.connectRoutes = connectRoutes;