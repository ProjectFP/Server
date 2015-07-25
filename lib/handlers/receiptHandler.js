var mongoose = require('mongoose');
var blue = require('bluebird');

var ObjectId = mongoose.Types.ObjectId;
var User     = require('../persistence/mongo/user').User;
var Period   = require('../persistence/mongo/receipt').Period;
var Receipt  = require('../persistence/mongo/receipt').Receipt;

function ReceiptHandler(){
    //link to Mongo
}

ReceiptHandler.prototype.addReceipt = function(req, res) {
    console.log('got to save!!!!!!!' + Object.keys(req.body));

    // console.log('**********jwt id:' + req.user.id + " type" + 
    //     typeof (req.user.id) + 'length ' + req.user.id.length);

    console.log('**********receipt id:' + req.body.receipt);

    User.addReceipt(req.user.id, req.body.period, req.body.receipt)
        .then(function(status){
            console.log('complete promise: ', status);
            res.send(status.code);
        }).done();

};



exports.ReceiptHandler = ReceiptHandler;
