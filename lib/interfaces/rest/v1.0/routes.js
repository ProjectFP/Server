var UploadHandler  = require('../../../handlers/uploadHandler');
var ReceiptHandler = require('../../../handlers/receiptHandler');
var UserHandler    = require('../../../handlers/userHandler');
var AuthHandler    = require('../../../handlers/authHandler');
var WinningHandler = require('../../../handlers/winningHandler');

uploadHandler = new UploadHandler.UploadHandler();
receiptHandler = new ReceiptHandler.ReceiptHandler();
userHandler = new UserHandler.UserHandler();
authHandler = new AuthHandler.AuthHandler();
winningHandler = new WinningHandler.WinningHandler();

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
        receiptHandler.addReceipt(req, res);
    });

    //accounts data
    expressApp.get('/account', function (req, res) {
        userHandler.getAccountData(req, res);
    });

    //authenticate token from client
    //return JWT
    expressApp.post('/login', function (req, res) {
        authHandler.login(req, res);
    });

    // add winning period
    expressApp.post('/winning', function (req, res) {
        winningHandler.parseAndAddPeriod(req, res);
    });

    expressApp.post('/processWinningPeriod', function (req, res) {
        winningHandler.processPeriodWinnings(req, res);
    });

    //dev only
    // grab JWT givenId
    expressApp.post('/getToken', function (req, res) {
        authHandler.getJWTGivenId(req, res);
    });

    // grab JWT givenId
    expressApp.post('/adduser', function (req, res) {
        userHandler.saveUser(req, res);
    });

    expressApp.post('/token', function (req, res) {
        // return the information including token as JSON
        console.log('******** '+ JSON.stringify(req.body));
        console.log('******** '+ JSON.stringify(req['user']));
        res.json({
            success: true,
            message: 'Accessed API endpoint---update',
        });
  
    });

    expressApp.all('*', function (req, res) {
        res.send(404, 'bad route');
    });
};


exports.connectRoutes = connectRoutes;