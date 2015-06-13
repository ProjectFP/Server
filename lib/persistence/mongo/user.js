var mongoose = require('mongoose');
var blue = require('bluebird');

var userSchema = mongoose.Schema({
    email:        {type: String, required: true, index: {unique: true}},
    name:         {type: String, required: true},
    createdAt:    {type: Date, default: Date.now, required: true},
    receipts:      {type: String, required: true}
    // receiptObjId: [Schema.Types.ObjectId]
});

var User = mongoose.model('User', userSchema);

User.promFindOne = blue.promisify(User.findOne);
User.promFindOneAndUpdate = blue.promisify(User.findOneAndUpdate);

exports.User = User;