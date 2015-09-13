var mongoose = require('mongoose');

var winningNumber = mongoose.Schema({
    numbers: [String],
    digits: {type: String, required: true},
    prizeName: {type: String, required: true},
    amount: {type: Number, required: true}
});

exports.winningNumber = winningNumber;
            