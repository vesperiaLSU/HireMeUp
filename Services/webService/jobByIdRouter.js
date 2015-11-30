(function() {
    "use strict";
    var express = require("express");
    var jobService = require("../dataService/jobService.js");
    var bodyParser = require("body-parser");
    var requireAuthentication = require("../requireAuthentication.js");

    var jobByIdRouter = express.Router();
    jobByIdRouter.use(bodyParser.json());

    // jobRouter.all("/jobs", requireAuthentication);
    // jobRouter.all("/jobs/:title", requireAuthentication);

    jobByIdRouter.route("/jobById/:id").delete(function(req, res, next) {
        var id = req.params.id;
        jobService.deleteJob(id).then(function(deleted) {
            res.send(deleted);
        }).catch(function(err) {
            res.status(404).send({
                message: err
            });
        });

    }).put(function(req, res, next) {
        var id = req.params.id;
        var update = req.body;
        jobService.updateJob(id, update).then(function(updated) {
            res.send(updated);
        }).catch(function(err) {
            res.status(404).send({
                message: err
            });
        });
    }).get(function(req, res, next) {
        var id = req.params.id;
        jobService.findOneJob(id).then(function(found) {
            if (found) {
                res.send(found);
            }
        }).catch(function(err) {
            res.status(404).send({
                message: err
            });
        });
    });

    jobByIdRouter.route("/jobById").get(function(req, res, next) {
        var jobList = JSON.parse(req.query.jobList);
        var query = {
            '_id': {
                $in: jobList
            }
        };
        jobService.findJobs(query).then(function(collection) {
            res.send(collection);
        }).catch(function(err) {
            res.status(500).send({
                message: err
            });
        });

    });

    module.exports = jobByIdRouter;
})();