var mongoose = require('mongoose');
var blue = require('bluebird');
var ObjectId = mongoose.Types.ObjectId;

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
    totalWinning:{type: Number},
    
});

var User = mongoose.model('User', userSchema);


User.promFindOne = blue.promisify(User.findOne);
User.promFindOneAndUpdate = blue.promisify(User.findOneAndUpdate);

User.addReceipt = function(objectId, period, receiptNumber, winningObj) {
    console.log('add Receipt function: ' + objectId + ", " + period+ ", " + receiptNumber);
    var objId = new ObjectId(objectId);
    var periodName = period;
    var entry = {number: receiptNumber};
    var that = this;
    if (winningObj){
        
    }

    return this.promFindOneAndUpdate(
        {
            _id: objId,
            'periods.periodName' : periodName
        },
        {
            $push: {
                'periods.$.entries': entry
            }
        },
        {
            safe: true, 
            new : true
        }
    ).then(function(model){
        console.log('first callback');

        if (model === null){
            return that.promFindOneAndUpdate(
                {
                    _id: objId
                },
                {
                    $push: {
                        'periods' : {
                            periodName: periodName,
                            entries: [ entry ]
                        }
                    }
                },
                {
                    safe: true, 
                    new : true
                }
            ).then(function(model){
                console.log('second level');
                return {
                    code: model? 200:500,
                    body: model? model:undefined
                };
            });
        } else{
            return {
                code: 200,
                body: model
            };
        }
    });
};


exports.User = User;