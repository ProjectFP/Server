var mongoose = require('mongoose');

var receiptSchema = require('./receipt').receiptSchema;

var periodSchema = mongoose.Schema({
    periodName:   {type: String, required: true},
    entries:      [receiptSchema],
    validated:    {type: Boolean, default: false}, //might not need this
    totalWinning: {type: Number, default: 0}
});

exports.periodSchema =periodSchema;