(function() {
    "use strict";
    var User = require("../Models/User.js");
    var tokenHandler = require("./tokenHandler.js");
    var messages = require("../Config/messageConfig.js");

    module.exports = function(req, res, next) {
        req.user = req.body;

        var searchUser = {
            email: req.user.email
        };

        User.findOne(searchUser, function(err, user) {
            if (err) throw err;

            if (!user) return res.status(401).send({
                message: messages.USER_NOT_FOUND
            });

            if (!user.password && user.googleId) return res.status(401).send({
                message: messages.GOOGLE_ACCOUNT_EXIST
            });

            if (!user.password && user.facebookId) return res.status(401).send({
                message: messages.FACEBOOK_ACCOUNT_EXIST
            });

            user.comparePasswords(req.user.password, function(err, isMatch) {
                if (err) throw err;

                if (!isMatch) return res.status(401).send({
                    message: messages.PASSWORD_NOT_MATCH
                });

                tokenHandler(user, req, res);
            });
        });
    };
}());
