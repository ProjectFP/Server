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

// Not Used
UserHandler.prototype.saveUser = function(req, res) {
    console.log('got to save user!!!!!!!');

    new User({
        fbId: '12312312312312131',
        email: 'test@test.com',
        name: 'test user',
        firstName: 'test',
        lastName: 'user'
    })
    .save(function (err, data) {
        if (data) {
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
        } else {
            // failed to save data
            res.json({
                success: false,
                message: 'failed to create user account',
            });
        }
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
