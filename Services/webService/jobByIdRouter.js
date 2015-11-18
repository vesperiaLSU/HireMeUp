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

    module.exports = jobByIdRouter;
}());