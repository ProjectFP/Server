var mongoose = require('mongoose');
var blue = require('bluebird');

var ObjectId = mongoose.Types.ObjectId;
var User     = require('../persistence/mongo/user').User;
var Period   = require('../persistence/mongo/receipt').Period;
var Receipt  = require('../persistence/mongo/receipt').Receipt;

function ReceiptHandler(){
    //link to Mongo
}

ReceiptHandler.prototype.saveReceipt = function(req, res) {
    console.log('got to save!!!!!!!' + Object.keys(req.body));
    var receipt = req.body.receipt; 
    var period = req.body.period;
    var collection = '';
    console.log('**********jwt id:' + req.user.id + " type" + 
        typeof (req.user.id) + 'length ' + req.user.id.length);
    var objectId = new ObjectId(req.user.id);

    console.log('**********receipt id:' + receipt);
    User.promFindOne({_id: objectId})
    .then(function(userObject){
        console.log('data:' + JSON.stringify(data));

        _.find(userObject.period, function(object){
            return object.periodName === ''
        })




        data.save(function(err, data){
            if (err){
                res.send(500, err);
            }
            res.send(201);
        });
        
        // console.log('collection:' + collection);
    });
    //     return User.promFindOneAndUpdate(
    //         {_id: objectId},
    //         {receipts: collection}
    //     );
    // }).then(function(data){
    //     console.log('after save data:' + JSON.stringify(data));
    //     res.send(201, collection);
    // }).catch(function(err){
    //     var error = 'Error with data submission: '+err;
    //     res.send(500, error);
    // });
};




// var processReceipt = function(receipt, period){
//     console.log('in process receipt:' + collectionStr);

//     return {
//         date: period,
//         number: 

//     };
// };



exports.ReceiptHandler = ReceiptHandler;
