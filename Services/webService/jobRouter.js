var express = require("express");
var jobService = require("../dataService/jobService.js");
var bodyParser = require("body-parser");

var jwt = require("jwt-simple");
var webConfig = require("../../Config/webConfig.js");
var messages = require("../../Config/messageConfig.js");
var User = require("../../Models/User.js");

var jobRouter = express.Router();
jobRouter.use(bodyParser.json());

jobRouter.route("/jobs")
    .get(function(req, res, next) {
        userAuth(req, res);
        if (res.statusCode !== 401) {
            jobService.findJobs({}).then(function(collection) {
                if (collection.length != 0) {
                    res.send(collection);
                }
                else {
                    res.status(401).send({
                        message: "failed to find a job"
                    });
                }
            });
        }
    })
    .post(function(req, res, next) {
        userAuth(req, res);
        if (res.statusCode !== 401) {
            var newJob = {
                title: req.body.title,
                description: req.body.description,
                company: req.body.company
            };
            jobService.saveJob(newJob);
        }
    });

jobRouter.route("/jobs/:title")
    .get(function(req, res, next) {
        userAuth(req, res);
        if (res.statusCode !== 401) {
            var searchBy = {
                title: req.params.title
            };
            jobService.findJobs(searchBy).then(function(collection) {
                if (collection.length != 0) {
                    res.send(collection);
                }
                else {
                    res.status(401).send({
                        message: "failed to find a job"
                    });
                }
            });
        }
    })
    .put(function(req, res, next) {
        jobService.updateJob(req.foundJob, req.body);
    });

function userAuth(req, res) {
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
        handleAuthentication(res, search);
    }
    else if (payload.fbId) {
        search = {
            facebookId: payload.fbId
        };
        handleAuthentication(res, search);
    }
    else {
        search = {
            email: payload.email
        };
        handleAuthentication(res, search);
    }
}

function handleError(res) {
    return res.status(401).send({
        message: messages.AUTHORIZATION_FAIL
    });
}

function handleAuthentication(res, search) {
    User.findOne(search, function(err, foundUser) {
        if (!foundUser)
            handleError(res);

        if (!foundUser.active) {
            return res.status(401).send({
                message: messages.NEED_ACTIVATION
            });
        }
    });
}

module.exports = jobRouter;