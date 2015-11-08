var express = require("express");
var dataService = require("../dataService/dataService.js");
var bodyParser = require("body-parser");
var loginHandler = require("../loginHandler.js");
var registerHandler = require("../registerHandler.js");

var jobRouter = express.Router();
jobRouter.use(bodyParser.json());

jobRouter.route("/login").post(loginHandler);

jobRouter.route("/register").post(registerHandler);

jobRouter.route("/jobs")
    .get(function(req, res, next) {
        dataService.findJobs({}).then(function(collection) {
            if (collection.length != 0) {
                res.send(collection);
            }
            else {
                res.status(401).send({
                    message: "failed to find a job"
                });
            }
        });
    })
    .post(function(req, res, next) {
        var newJob = {
            title: req.body.title,
            description: req.body.description
        };
        dataService.saveJob(newJob);
    });

jobRouter.route("/jobs/:title")
    .get(function(req, res, next) {
        if (req.params.title) {
            var searchBy = {
                title: req.params.title
            };
            dataService.findJobs(searchBy).then(function(collection) {
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
        dataService.updateJob(req.foundJob, req.body);
    });



module.exports = jobRouter;