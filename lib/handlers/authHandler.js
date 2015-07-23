var jwToken        = require('jsonwebtoken');

var config  = require('../../config').getConfig();
var User    = require('../persistence/mongo/user').User;

function AuthHandler(){
    //Link for test
}

AuthHandler.prototype.login = function(req, res) {
    console.log('login body: ' + JSON.stringify(req.body));
    var email = req.body.email;

    User.promFindOne({email: email})
    .then(function(user){   

        if (!user) {
            res.json({ success: false, message: 'Authentication failed. User not found.' });
        } else if (user) {

            // check if password matches
            if (false) {
                res.json({ success: false, message: 'Authentication failed. Wrong password.' });
            } else {
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
            }
        }
    }).catch(function(err){
        var error = 'Error with login: '+ err;
        res.send(500, error);
    });
};

exports.AuthHandler = AuthHandler;
