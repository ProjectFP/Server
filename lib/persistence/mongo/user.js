var mongoose = require('mongoose');
var blue = require('bluebird');
var ObjectId = mongoose.Types.ObjectId;
var _        = require('lodash');

var periodSchema = require('./period').periodSchema;

var userSchema = mongoose.Schema({
    fbId:        {type: String, required: true, index: {unique: true}},
    email:       {type: String},
    name:        {type: String, required: true},
    firstName:   {type: String},
    lastName:    {type: String},
    createdAt:   {type: Date, default: Date.now, required: true},
    periods:     [periodSchema],
    version:     {type: String, default: '0.0.0', required: true},
    totalWinning:{type: Number}
});

var User = mongoose.model('User', userSchema);


User.promFindOne = blue.promisify(User.findOne);
User.promFindOneAndUpdate = blue.promisify(User.findOneAndUpdate);

User.addReceipt = function(objectId, period, receiptNumber, winningObj) {
    console.log('add Receipt function: ' + objectId + ", " + period+ ", " + receiptNumber);
    var objId = new ObjectId(objectId);
    var periodName = period;
    var entry = {number: receiptNumber};
    var totalWinningPeriod = 0;
    var that = this;
    if (winningObj){
        totalWinningPeriod = winningObj.amount;
        entry.WinnigTicketId = new ObjectId(winningObj._id);
        entry.winningAmount = winningObj.amount;
        entry.prizeName = winningObj.prizeName;
    }
    console.log('entires: ' + JSON.stringify(entry));

    return this.promFindOne(
        {
            _id: objId,
            'periods.periodName' : periodName
        }
    ).then(function(model){
        if (model === null){
            console.log("can't find period model");
            return that.promFindOne(
                {
                    _id: objId
                }
            ).then(function(model){
                if (model){
                    console.log('found user model');
                    model.periods.push({
                        periodName: periodName,
                        entries: [ entry ],
                        totalWinning: totalWinningPeriod
                    });
                    console.log('pushed period in to array');
                    return model.save();
                }
            });
        } else{
            console.log('found period model: ' + JSON.stringify(model.periods));
            //This is ugly, find the id to reference it back to the period
            // must be a better way to do this
            var id = _.findWhere(model.periods.toObject(), {periodName: periodName})._id;
            console.log('found id: ' + JSON.stringify(id));
            var reference = model.periods.id(id);
            reference.entries.push(entry);
            if (winningObj) {
                reference.totalWinning = reference.totalWinning? (reference.totalWinning + winningObj.amount) : winningObj.amount;
                reference.validated = true;
            }
            return model.save();
        }
    }).then(function(model){
        if (winningObj){
            if (model.totalWinning){            
                model.totalWinning = model.totalWinning + winningObj.amount;
            } else {
                 model.totalWinning = winningObj.amount;
            }
            return model.save();
        }
        return new blue (function(resolve, reject){
            console.log('no update to user totalWinning');
            resolve(model);
        });
    }).then(function(model){
        console.log('model saved');
        return {
            code: 200,
            body: model
        };
    }).catch(function(err){
        return {
            code: 500,
            body: err
        };
    });
};


// User.addReceipt = function(objectId, period, receiptNumber, winningObj) {
//     console.log('add Receipt function: ' + objectId + ", " + period+ ", " + receiptNumber);
//     var objId = new ObjectId(objectId);
//     var periodName = period;
//     var entry = {number: receiptNumber};
//     var that = this;
//     if (winningObj){

//     }

//     return this.promFindOneAndUpdate(
//         {
//             _id: objId,
//             'periods.periodName' : periodName
//         },
//         {
//             $push: {
//                 'periods.$.entries': entry
//             }
//         },
//         {
//             safe: true, 
//             new : true
//         }
//     ).then(function(model){
//         console.log('first callback');

//         if (model === null){
//             return that.promFindOneAndUpdate(
//                 {
//                     _id: objId
//                 },
//                 {
//                     $push: {
//                         'periods' : {
//                             periodName: periodName,
//                             entries: [ entry ]
//                         }
//                     }
//                 },
//                 {
//                     safe: true, 
//                     new : true
//                 }
//             ).then(function(model){
//                 console.log('second level');
//                 return {
//                     code: model? 200:500,
//                     body: model? model:undefined
//                 };
//             });
//         } else{
//             return {
//                 code: 200,
//                 body: model
//             };
//         }
//     });
// };


exports.User = User;