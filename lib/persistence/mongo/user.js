var mongoose = require('mongoose');
var blue = require('bluebird');

var periodSchema = require('./period').periodSchema;

var userSchema = mongoose.Schema({
    email:       {type: String, required: true, index: {unique: true}},
    name:        {type: String, required: true},
    createdAt:   {type: Date, default: Date.now, required: true},
    period:      [periodSchema],
    periodIndex: {type: mongoose.Schema.Types.Mixed},
    version:     {type: String, default: '0.0.0', required: true}
});

var User = mongoose.model('User', userSchema);

User.promFindOne = blue.promisify(User.findOne);
User.promFindOneAndUpdate = blue.promisify(User.findOneAndUpdate);

exports.User = User;