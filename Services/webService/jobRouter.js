(function() {
    "use strict";
    var express = require("express");
    var jobService = require("../dataService/jobService.js");
    var bodyParser = require("body-parser");
    var requireAuthentication = require("../requireAuthentication.js");

    var jobRouter = express.Router();
    jobRouter.use(bodyParser.json());

    // jobRouter.all("/jobs", requireAuthentication);
    // jobRouter.all("/jobs/:title", requireAuthentication);
    jobRouter.route("/jobs")
        .get(function(req, res, next) {
            jobService.findJobs({}).then(function(collection) {
                if (collection.length != 0) {
                    res.send(collection);
                }
                else {
                    res.status(404).send({
                        message: "failed to find any job"
                    });
                }
            }, function(err) {
                res.status(500).send({
                    message: err
                });
            });

        })
        .post(function(req, res, next) {
            var newJob = {
                title: req.body.title,
                description: req.body.description,
                company: req.body.company
            };
            jobService.saveJob(newJob).then(function(job) {
                res.send(job);
            }).catch(function(err) {
                console.log(err);
                res.status(500).send({
                    message: "failed to save the job"
                });
            });
        });

    jobRouter.route("/jobs/:title")
        .get(function(req, res, next) {
            var searchBy = {
                title: {
                    $regex: req.params.title,
                    $options: "i"
                }
            };
            jobService.findJobs(searchBy).then(function(collection) {
                res.send(collection);
            }, function(err) {
                res.status(404).send({
                    message: err
                });
            });

        });

    module.exports = jobRouter;
})();