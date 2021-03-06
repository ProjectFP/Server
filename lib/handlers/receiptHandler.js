var mongoose       = require('mongoose');
var blue           = require('bluebird');

var ObjectId       = mongoose.Types.ObjectId;
var User           = require('../persistence/mongo/user').User;
var Period         = require('../persistence/mongo/period').Period;
var Receipt        = require('../persistence/mongo/receipt').Receipt;
var WinningPeriod  = require('../persistence/mongo/winningPeriod').WinningPeriod;

function ReceiptHandler(){
    //link to Mongo
}

ReceiptHandler.prototype.addReceipt = function(req, res) {

    // console.log('**********jwt id:' + req.user.id + " type" + 
    //     typeof (req.user.id) + 'length ' + req.user.id.length);

    console.log('receipt id:' + req.body.period);

    if (req.body && req.body.receipt && req.body.period){
        WinningPeriod.checkForWinningReceipt(req.body.period, req.body.receipt)
        .then(function(winningObj){

            return User.addReceipt(req.user.id, 
                                   req.body.period, 
                                   req.body.receipt, 
                                   winningObj);
        })
        .then(function(status){
            console.log('complete promise: ', status);
            // possibly limit the return to the period
            res.send(status.code, status.body);
        }).done();

    } else {
        console.log('missing params');

        return res.send(400,{ 
            message: 'Missing Parameters:' + JSON.stringify(req.body)
        });
    }
};


exports.ReceiptHandler = ReceiptHandler;
