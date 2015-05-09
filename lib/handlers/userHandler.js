var mongoose = require('mongoose');
var blue = require('bluebird');

var mongoDriver = require('../persistence/mongo/mongoDriver');
var User = require('../persistence/mongo/user').User;

function UserHandler(){
    //testing
}

UserHandler.prototype.saveUser = function(req, res) {
    console.log('got to save user!!!!!!!' + JSON.stringify(req.body));
    var email = req.body.email;
    var name = req.body.name;

    new User({
        email: email,
        name: name,
        receipts: '{}'
    })
    .save(function (err, data) {
        if (err) {
            console.log('error:', err);
            res.send(500);
        }else{
            res.send(200);
        }
    });
};

exports.UserHandler = UserHandler;
