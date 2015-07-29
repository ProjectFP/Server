var jwToken        = require('jsonwebtoken');

var config  = require('../../config').getConfig();
var User    = require('../persistence/mongo/user').User;

function AuthHandler(){
    //Link for test
}

AuthHandler.prototype.login = function(req, res) {
    console.log('login body: ' + JSON.stringify(req.body));
    var email = req.body.email;
    // get facebook auth token
    // hit facebook api to get user email


    User.promFindOne({email: email})
    .then(function(user){   

        if (user) {
            console.log('*******_id:' + JSON.stringify(user._id));
            var token = jwToken.sign({
                id: user._id
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
            res.json({ success: false, message: 'Authentication failed. User not found.' });
        }

    }).catch(function(err){
        var error = 'Error with login: '+ err;
        res.send(500, error);
    });
};

AuthHandler.prototype.register = function(req, res) {
    //get token to facebook
    // hit facebook api to get user data
    // call user hander to create an account??
};

exports.AuthHandler = AuthHandler;
