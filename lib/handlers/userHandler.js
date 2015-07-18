var mongoose = require('mongoose');
var blue = require('bluebird');
var jwToken        = require('jsonwebtoken');

var mongoDriver = require('../persistence/mongo/mongoDriver');
var User = require('../persistence/mongo/user').User;
var Receipt = require('../persistence/mongo/receipt').Receipt;

function UserHandler(){
    //testing
}

UserHandler.prototype.saveUser = function(req, res, options) {
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
            new Receipt({
                userId: data._id,
                peroid: []
            }).save(function(err, data){
                console.log('*******_id:' + JSON.stringify(data._id));
                var token = jwToken.sign({
                    id: data._id
                }, options.publicKey, {
                    expiresInMinutes: 1440 // expires in 24 hours
                });

                // return the information including token as JSON
                res.json({
                    success: true,
                    message: 'Here is JWT token!',
                    token: token
                });
            });
        }
    });
};

exports.UserHandler = UserHandler;
