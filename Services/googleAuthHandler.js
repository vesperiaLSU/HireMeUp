(function() {
    "use strict";
    var request = require("request");
    var tokenHandler = require("./tokenHandler.js");
    var User = require("../Models/User.js");
    var webConfig = require("../Config/webConfig.js");
    var emailVerification = require("./emailVerification.js");

    module.exports = function(req, res) {
        var params = {
            client_id: req.body.clientId,
            redirect_uri: req.body.redirectUri,
            code: req.body.code,
            grant_type: "authorization_code",
            client_secret: webConfig.GOOGLE_SECRET
        };

        var config = {
            json: true,
            form: params
        };

        request.post(webConfig.GOOGLE_URL, config, function(err, response, token) {
            var accessToken = token.access_token;
            var headers = {
                Authorization: "Bearer " + accessToken
            };

            var config = {
                url: webConfig.GOOGLE_API,
                headers: headers,
                json: true
            };

            request.get(config, function(err, response, profile) {
                User.findOne({
                    googleId: profile.sub
                }, function(err, foundUser) {
                    if (err) throw err;
                    if (foundUser) {
                        if (foundUser.active == true)
                            return tokenHandler(foundUser, req, res);
                        else {
                            foundUser.host = req.hostname;
                            emailVerification.send(foundUser);
                            return tokenHandler(foundUser, req, res);
                        }

                    }
                    else {
                        var newUser = new User({
                            googleId: profile.sub,
                            displayName: profile.name,
                            email: profile.email,
                            active: false
                        });
                        newUser.save(function(err) {
                            if (err) throw err;
                            newUser.host = req.hostname;
                            emailVerification.send(newUser);
                            tokenHandler(newUser, req, res);
                        });
                    }
                });
            });
        });
    };
})();
