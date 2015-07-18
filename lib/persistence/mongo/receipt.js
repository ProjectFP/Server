var mongoose = require('mongoose');

var blue = require('bluebird');

var entrySchema = mongoose.Schema({
    date: String,
    number: Number
});

var periodsSchema = mongoose.Schema({
    periodName: String,
    entries: [entrySchema]
});

var lotteryDataSchema = mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    periods: [periodsSchema]
});

var Receipt = mongoose.model('receipt', lotteryDataSchema);

Receipt.promFindOne = blue.promisify(Receipt.findOne);
Receipt.promFindOneAndUpdate = blue.promisify(Receipt.findOneAndUpdate);

exports.Receipt = Receipt;