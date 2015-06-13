var mongoose = require('mongoose');
var blue = require('bluebird');

var receiptSchema = mongoose.Schema({
    email:        {type: String, required: true, index: {unique: true}},
    name:         {type: String, required: true},
    createdAt:    {type: Date, default: Date.now, required: true},
    receipts:      {type: String, required: true},
});

var Receipt = mongoose.model('receipt', receiptSchema);

Receipt.promFindOne = blue.promisify(Receipt.findOne);
Receipt.promFindOneAndUpdate = blue.promisify(Receipt.findOneAndUpdate);

exports.Receipt = Receipt;