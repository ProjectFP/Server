var mongoose = require('mongoose');
var blue     = require('bluebird');
var jwToken  = require('jsonwebtoken');

var config      = require('../../config').getConfig();
var mongoDriver = require('../persistence/mongo/mongoDriver');
var User        = require('../persistence/mongo/user').User;
var Receipt     = require('../persistence/mongo/receipt').Receipt;

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
    })
    .save(function (err, data) {
        console.log('_id:' + JSON.stringify(data._id));
        var token = jwToken.sign({
            id: data._id
        }, config.SUPER_SECRET, {
            expiresInMinutes: 1440 // expires in 24 hours
        });

        // return the information including token as JSON
        res.json({
            success: true,
            message: 'Here is JWT token!',
            token: token
        });
    });
};

UserHandler.prototype.getAccountData = function(req, res) {
    console.log('get account data!!!!!!! objectID: ' + req.user.id);

    User.promFindOne({
        _id: req.user.id,
    }).then(function(model){
        if(model){
            res.send(200, model);
        } else{
            res.send(400);
        }
    }).done();
};

exports.UserHandler = UserHandler;
