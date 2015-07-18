var mongoose = require('mongoose');
var blue = require('bluebird');

var ObjectId = mongoose.Types.ObjectId;
var User = require('../persistence/mongo/user').User;
var receipt = require('../persistence/mongo/receipt').Receipt;

function ReceiptHandler(){
    //link to Mongo
}

ReceiptHandler.prototype.saveReceipt = function(req, res) {
    console.log('got to save!!!!!!!' + JSON.stringify(req.body));
    var receipt = req.body.receipt; 
    var period = req.body.period;
    var collection = '';
    // console.log('**********jwt id:' + req.user.id + " type" + 
    //     typeof (req.user.id) + 'length ' + req.user.id.length);
    var objectId = new ObjectId(req.user.id);

    // console.log('**********jwt object id:' + objectId + " type" + typeof (objectId));
    User.promFindOne({_id: objectId})
    .then(function(data){
        console.log('data:' + JSON.stringify(data));

        collection = processReceipt(receipt, period, data.receipts);

        console.log('collection:' + collection);

        return User.promFindOneAndUpdate(
            {_id: objectId},
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
