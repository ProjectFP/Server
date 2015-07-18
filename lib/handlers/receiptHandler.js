var mongoose = require('mongoose');
var blue = require('bluebird');

var mongoDriver = require('../persistence/mongo/mongoDriver');
var User = require('../persistence/mongo/user').User;

function ReceiptHandler(){
    //link to Mongo
}

ReceiptHandler.prototype.saveReceipt = function(req, res) {
    console.log('got to save!!!!!!!' + JSON.stringify(req.body));
    var email = req.body.email;
    var receipt = req.body.receipt; 
    var period = req.body.period;
    var collection = '';

    User.promFindOne({email: email})
    .then(function(data){
        console.log('data:' + JSON.stringify(data));

        collection = processReceipt(receipt, period, data.receipts);

        console.log('collection:' + collection);

        return User.promFindOneAndUpdate(
            {email: email},
            {receipts: collection}
        );
    }).then(function(data){
        console.log('after save data:' + JSON.stringify(data));
        res.send(201, collection);
    }).catch(function(err){
        var error = 'Error with data submission: '+err;
        res.send(500, error);
    });
};

var processReceipt = function(receipt, period, collectionStr){
    console.log('in process receipt:' + collectionStr);
    var collection = JSON.parse(collectionStr);

    if (!collection[period]){
        collection[period] = {};
    }

    var dateStr = new Date().toString();

    collection[period][receipt] = {
        date: dateStr
    };

    return JSON.stringify(collection);
};

exports.ReceiptHandler = ReceiptHandler;
