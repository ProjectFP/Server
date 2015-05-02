var mongoose = require('mongoose');
var blue = require('bluebird');

var mongoDriver = require('../persistence/mongo/mongoDriver');
var User = require('../persistence/mongo/user').User;

function ReceiptHandler(){
    //link to Mongo
}

ReceiptHandler.prototype.saveReceipt = function(req, res) {
    console.log('got to save!!!!!!!');

};

exports.ReceiptHandler = ReceiptHandler;
