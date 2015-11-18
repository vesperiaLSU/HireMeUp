(function() {
    'use strict';
    var jwt = require("jwt-simple");
    var webConfig = require("../Config/webConfig.js");
    var messages = require("../Config/messageConfig.js");
    var User = require("../Models/User.js");

    module.exports = function requireAuthentication(req, res, next) {
        var _ = require("underscore");
        var nonSecurePaths = ["/", "/jobs", "/jobs/:title"];
        if (_.contains(nonSecurePaths, req.route.path) && req.method === 'GET') {
            return next();
        }

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
            handleAuthentication(res, next, search);
        }
        else if (payload.fbId) {
            search = {
                facebookId: payload.fbId
            };
            handleAuthentication(res, next, search);
        }
        else {
            search = {
                email: payload.email
            };
            handleAuthentication(res, next, search);
        }
    };

    function handleError(res) {
        return res.status(401).send({
            message: messages.AUTHORIZATION_FAIL
        });
    }

    function handleAuthentication(res, next, search) {
        User.findOne(search).then(function(foundUser) {
            if (!foundUser) {
                handleError(res);
            }
            else if (!foundUser.active) {
                return res.status(401).send({
                    message: messages.NEED_ACTIVATION
                });
            }
            else {
                next();
            }
        }).catch(function(err) {
            return res.status(401).send({
                message: err
            });
        });
    }
}());