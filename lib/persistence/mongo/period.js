var mongoose = require('mongoose');
var blue = require('bluebird');

var receiptSchema = require('./receipt').receiptSchema;

var periodSchema = mongoose.Schema({
    periodName: {type: String, required: true},
    entries: [receiptSchema]
});

exports.periodSchema =periodSchema;