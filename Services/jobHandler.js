(function() {
    var jwt = require("jwt-simple");
    var webConfig = require("../Config/webConfig.js");
    var messages = require("../Config/messageConfig.js");
    var User = require("../Models/User.js");
    var dataService = require("./dataService/dataService.js");

    module.exports = function(req, res) {
        //check if the header contains an authorization
        /** @namespace req.headers.authorization */
        if (!req.headers.authorization) {
            return res.status(401).send({
                message: messages.LACK_AUTHORIZATION
            });
        }

        //if the header contains an authorization, retrieve the token from it
        var token = req.headers.authorization.split(" ")[1];
        var payload = jwt.decode(token, webConfig.LOGIN_SECRET);
        var search = {};

        if (!payload.email) {
            return res.status(401).send({
                message: messages.AUTHORIZATION_FAIL
            });
        }

        if (payload.ggId) {
            search = {
                googleId: payload.ggId
            };
            handleJob(res, search);
        }
        else if (payload.fbId) {
            search = {
                facebookId: payload.fbId
            };
            handleJob(res, search);
        }
        else {
            search = {
                email: payload.email
            };
            handleJob(res, search);
        }
    };

    function handleError(res) {
        return res.status(401).send({
            message: messages.AUTHORIZATION_FAIL
        });
    }

    function handleJob(res, search) {
        User.findOne(search, function(err, foundUser) {
            if (!foundUser) return handleError(res);

            if (!foundUser.active) {
                return res.status(401).send({
                    message: messages.NEED_ACTIVATION
                });
            }
            dataService.findJobs({}).then(function(collection){
                res.send(collection);
            });
        });
    }
}());
