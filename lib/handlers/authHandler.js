var jwToken     = require('jsonwebtoken');
var rp          = require('request-promise');
var querystring = require('querystring');

var config  = require('../../config').getConfig();
var User    = require('../persistence/mongo/user').User;

//Test token
var tempFbToken =  "CAAGz5L2jcI0BAMZCvutyMlS8ajGFcKOzopg3UZCDwNmTqPYxvB0sS9BhIbLsW3rZCaOqVjBzzqMTOsbSJPidtVN6HnkAPfwuMLp4tprsz9UulL1ZCPGgWQaW0hDAej8eYtQCnvI5AZAcTmKWzdFPwfy7eLy5oFzRDcZC6YhIVeaIZBb350heKiELppW84UaEldWAiQ4kerMQslz2mHZAeEE4";


function AuthHandler(){
    //Link for test

    // Get App Access Token
    //  GET /oauth/access_token?
    //  client_id={app-id}
    // &client_secret={app-secret}
    // &grant_type=client_credentials
}

AuthHandler.prototype.login = function(req, res) {
    console.log('login body: ' + JSON.stringify(req.body));
    // var email = req.body.email;
    var token = req.body.token || tempFbToken;
    var retObj;

    _fbAuthentication(token)
    .then(function(response){
        retObj = JSON.parse(response);
        return User.promFindOne({fbId: retObj.id});
    })
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
                token: token,
                body: user
            });
        } else {
            new User({
                fbId: retObj.id,
                email: retObj.email,
                name: retObj.name,
                firstName: retObj.first_name,
                lastName: retObj.last_name
            })
            .save(function (err, user) {
                console.log('_id:' + JSON.stringify(user._id));
                var token = jwToken.sign({
                    id: user._id
                }, config.SUPER_SECRET, {
                    expiresInMinutes: 1440 // expires in 24 hours
                });

                // return the information including token as JSON
                res.json({
                    success: true,
                    message: 'Here is JWT token!',
                    token: token,
                    body: user
                });
            });
        }

    }).catch(function(err){
        var error = 'Error with login: '+ err;
        res.send(500, error);
    });
};

AuthHandler.prototype.getJWTGivenId = function(req, res) {
    console.log('*******_id:' + JSON.stringify(req.id));
    var token = jwToken.sign({
        id: req.id
    }, config.SUPER_SECRET, {
        expiresInMinutes: 1440 // expires in 24 hours
    });

    // return the information including token as JSON
    res.json({
        success: true,
        message: 'Here is JWT token!',
        token: token
    });
};

// Kept for reference, but not used
AuthHandler.prototype.register = function(req, res) {
    var token = req.body.token || tempFbToken;
    var retObj = {};

    _fbAuthentication(token)
    .then(function(response){
        retObj = JSON.parse(response);
        console.log('from facebook: ' + response);

        return User.promFindOne({fbId: retObj.id});
    })
    .then(function(user){
        if (user){
            res.send(400,{message: 'User already has an account' });
        } else {        
            new User({
                fbId: retObj.id,
                email: retObj.email,
                name: retObj.name,
                firstName: retObj.first_name,
                lastName: retObj.last_name
            })
            .save(function (err, user) {
                console.log('_id:' + JSON.stringify(user._id));
                var token = jwToken.sign({
                    id: user._id
                }, config.SUPER_SECRET, {
                    expiresInMinutes: 1440 // expires in 24 hours
                });

                // return the information including token as JSON
                res.json({
                    success: true,
                    message: 'Here is JWT token!',
                    token: token,
                    body: user
                });
            });
        }
    }).catch(function(err){
        var error = 'Error with login: '+ err;
        res.send(500, error);
    });

};

var _fbAuthentication = function(token){

    var reqObj = {
        uri : 'https://graph.facebook.com/me',
        method : 'GET',
        headers: {
            Authorization: 'OAuth ' + token
        }
    };
    return rp(reqObj);
};


exports.AuthHandler = AuthHandler;
