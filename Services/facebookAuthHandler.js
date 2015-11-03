(function() {
    var request = require("request");
    var User = require("../Models/User.js");
    var tokenHandler = require("./tokenHandler.js");
    var emailVerification = require("./emailVerification.js");
    var webConfig = require("../Config/webConfig.js");

    module.exports = function(req, res) {
        var params = {
            client_id: req.body.clientId,
            client_secret: webConfig.FACEBOOK_SECRET,
            redirect_uri: req.body.redirectUri,
            code: req.body.code
        };

        request.post({
            url: webConfig.FACEBOOK_URL,
            qs: params
        }, function(err, response, accessToken) {
            if (err)
                console.log(err);

            accessToken = JSON.parse(accessToken);
            var params = {
                access_token: accessToken.access_token,
                fields: "id,email,name"
            };

            request.get({
                url: webConfig.FACEBOOK_API,
                qs: params,
                json: true
            }, function(err, response, profile) {
                if (err)
                    console.log(err);
                User.findOne({
                    facebookId: profile.id
                }, function(err, foundUser) {
                    if (foundUser) {
                        if (foundUser.active == true)
                            return tokenHandler(foundUser, req, res);
                        else {
                            emailVerification.send(foundUser);
                            return tokenHandler(foundUser, req, res);
                        }
                    }
                    else {
                        var newUser = new User({
                            facebookId: profile.id,
                            displayName: profile.name,
                            email: profile.email,
                            active: false
                        });
                        newUser.save(function(err) {
                            emailVerification.send(newUser);
                            tokenHandler(newUser, req, res);
                        })
                    }
                })
            });
        });
    };
}());
