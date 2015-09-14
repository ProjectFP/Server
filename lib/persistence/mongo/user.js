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
    totalWinning:{type: Number, default: 0}
});

var User = mongoose.model('User', userSchema);


User.promFind = blue.promisify(User.find);
User.promFindOne = blue.promisify(User.findOne);
User.promFindOneAndUpdate = blue.promisify(User.findOneAndUpdate);

User.addReceipt = function(objectId, period, receiptNumber, winningObj) {
    console.log('add Receipt function: ' + objectId + ", " + period+ ", " + receiptNumber);
    var objId = new ObjectId(objectId);
    var periodName = period;
    var entry = {number: receiptNumber};
    var winningAmount = 0;
    var that = this;
    if (winningObj){
        winningAmount = winningObj.amount;
        entry.WinnigTicketId = winningObj._id;
        entry.winningAmount = winningAmount;
        entry.prizeName = winningObj.prizeName;
    }
    console.log('entires: ' + JSON.stringify(entry));

    return this.promFindOneAndUpdate(
        {
            _id: objId,
            'periods.periodName' : periodName
        },
        {
            $push: {
                'periods.$.entries': entry
            },
            $inc: {
                'periods.$.totalWinning': winningAmount,
                'totalWinning': winningAmount
            }
        },
        {
            safe: true, 
            new : true
        }
    ).then(function(model) {
        if (model === null) {
            console.log("can't find period model");
            return that.promFindOne(
                {
                    _id: objId
                }
            ).then(function(model) {
                if (model){
                    console.log('found user model');
                    model.periods.push({
                        periodName: periodName,
                        entries: [ entry ],
                        totalWinning: winningAmount
                    });
                    if(winningObj){                    
                        model.totalWinning = model.totalWinning + winningObj.amount;
                    }
                    console.log('pushed period in to array');
                    return model.save();
                }
            });
        }
        return new blue (function(resolve, reject) {
            console.log('return existing model');
            resolve(model);
        });
    }).then(function(model) {
        console.log('model saved');
        return {
            code: 200,
            body: model
        };
    }).catch(function(err) {
        return {
            code: 500,
            body: err
        };
    });
};

User.searchAllUsers = function(winningModel) {
    return this.promFind({
        'periods.periodName' : winningModel.periodName
    }).then(function(userModels){
        if (userModels){
            console.log('found all users:' + JSON.stringify(userModels));
            var promiseArray =  userModels.map(function(userModel){
                //find period
                console.log('map user model to promise: ' +JSON.stringify(userModel.periods.toObject()));
                focusPeriod = _.findWhere(userModel.periods.toObject(), {periodName: winningModel.periodName});
                console.log('found focus period: ' + JSON.stringify(focusPeriod));
                //cycle through the list for comparison
                if (!focusPeriod.validated){
                    _.each(focusPeriod.entries, function(entry){
                        var winningObj = _checkRecieptAgainstSet(winningModel, entry.number);
                        if (winningObj){
                            console.log('found winning entry');
                            //update match
                            var period  = userModel.periods.id(focusPeriod._id);
                            console.log('map user period to update: ' +JSON.stringify(period));
                            var ticket = period.entries.id(entry._id);
                            console.log('map user ticket to update: ' +JSON.stringify(ticket));
                            ticket.WinnigTicketId = winningObj._id;
                            ticket.winningAmount = winningObj.amount;
                            ticket.prizeName = winningObj.prizeName;
                            period.totalWinning = period.totalWinning + winningObj.amount;
                            period.validated = true;
                            userModel.totalWinning = userModel.totalWinning + winningObj.amount;
                        }
                    });
                    return userModel.save();
                }
            });
            return blue.all(promiseArray);
        }
        return new blue (function(resolve, reject) {
            console.log('no models updated');
            resolve(model);
        });
    }).then(function(models){
        console.log('complete all promises');
        return {
            code: 200,
            body: models
        };
    }).catch(function(err){
        console.log(err);
        return {
            code: 500,
            body: err
        };
    });
};


function _checkRecieptAgainstSet(winningModel, receipt) {
    var retObj;

    for (var i=0; i< winningModel.tickets.length; i++){
        if (!retObj){                
            var digits = winningModel.tickets[i].digits;
            var userNumber = receipt.slice(-1*digits);
            var winningNumber = receipt.slice(-1*digits);
             if (_.contains(winningModel.tickets[i].numbers, userNumber)){
                retObj = {
                    _id: winningModel.tickets[i]._id,
                    prizeName: winningModel.tickets[i].prizeName,
                    amount: winningModel.tickets[i].amount
                };
             }
        }
    }
    return retObj;
}

exports.User = User;