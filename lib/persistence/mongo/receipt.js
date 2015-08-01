var mongoose = require('mongoose');
var blue = require('bluebird');

var receiptSchema = mongoose.Schema({
    createdAt: {type: Date, default: Date.now, required: true},
    number: {type: String, required: true}
});

exports.receiptSchema = receiptSchema;