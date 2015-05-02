var mongoose = require('mongoose');
var blue = require('bluebird');

var userSchema = mongoose.Schema({
    email:        {type: String, required: true, index: {unique: true}},
    Name:         {type: String, required: true},
    createdAt:    {type: Date, default: Date.now, required: true},
    receipt:      {type: mongoose.Schema.Types.Mixed}
});

var User = mongoose.model('User', userSchema);

User.promFindOne = blue.promisify(User.findOne);
User.promFindOneAndUpdate = blue.promisify(User.findOneAndUpdate);

exports.User = User;