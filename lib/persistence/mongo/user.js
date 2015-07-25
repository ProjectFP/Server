var mongoose = require('mongoose');
var blue = require('bluebird');
var ObjectId = mongoose.Types.ObjectId;

var periodSchema = require('./period').periodSchema;

var userSchema = mongoose.Schema({
    email:       {type: String, required: true, index: {unique: true}},
    name:        {type: String, required: true},
    createdAt:   {type: Date, default: Date.now, required: true},
    periods:      [periodSchema],
    version:     {type: String, default: '0.0.0', required: true}
});

var User = mongoose.model('User', userSchema);


User.promFindOne = blue.promisify(User.findOne);
User.promFindOneAndUpdate = blue.promisify(User.findOneAndUpdate);

User.addReceipt = function(objectId, period, receiptNumber, req, res) {
    console.log('add Receipt function: ' + objectId + ", " + period+ ", " + receiptNumber);
    var objId = new ObjectId(objectId);
    var periodName = period;
    var entry = {number: receiptNumber};
    var that = this;

    return this.promFindOneAndUpdate(
        {
            _id: objId,
            'periods.periodName' : periodName
        },
        {
            $push: {
                'periods.$.entries': entry
            }
        }
    ).then(function(model){
        console.log('model:', model);

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
                }

            ).then(function(model){
                console.log('second level: ' + model);
                return {
                    code: model? 201:500
                };
            });
        } else{
            return {
                code: 201
            };
        }
    });
};


exports.User = User;