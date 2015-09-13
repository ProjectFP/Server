var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;


var receiptSchema = mongoose.Schema({
    createdAt: {type: Date, default: Date.now, required: true},
    number: {type: String, required: true},
    winningTicketId: mongoose.Schema.Types.ObjectId,
    winningPeriod: {type: String},
    winningAmount: {type: Number},
    prizeName: {type: String}
});

exports.receiptSchema = receiptSchema;