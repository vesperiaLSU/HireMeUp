(function() {
    var User = require("../Models/User.js");
    var tokenHandler = require("./tokenHandler.js");
    var messages = require("../Config/messageConfig.js");
    var emailVerification = require("./emailVerification.js");

    module.exports = function(req, res, next) {
        var user = req.body;
        var newUser = new User({
            email: user.email,
            password: user.password,
            active: false
        });

        var searchUser = {
            email: user.email
        };

        User.findOne(searchUser).then(function(user) {
            if (user) return res.status(401).send({
                message: messages.EMAIL_DUPLICATE
            });

            newUser.save().then(function() {
                searchUser.host = req.hostname;
                emailVerification.send(searchUser);
                tokenHandler(newUser, req, res);
            }).catch(function(err) {
                throw err;
            });
        }).catch(function(err) {
            return res.status(500).send({
                message: "Server could not register user"
            });
        });
    };
}());
