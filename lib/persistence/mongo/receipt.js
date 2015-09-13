var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;


var receiptSchema = mongoose.Schema({
    createdAt: {type: Date, default: Date.now, required: true},
    number: {type: String, required: true},
    winningTicketId: mongoose.Schema.Types.ObjectId,
    winningAmount: {type: Number},
    prizeName: {type: String},
    validated: {type: Boolean, default: false}
});

exports.receiptSchema = receiptSchema;