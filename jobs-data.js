var Promise = require("bluebird");
var Job = require("./models/Job.js");

exports.findJobs = function (query) {
    return Promise.cast(Job.find(query).exec());
}

exports.saveJob = function(job) {
    return Promise.cas(Job.create(job).exec());
}

exports.seedJobs = function() {
    return new Promise(function(resolve, reject) {
        Job.find({}).exec(function(err, collection) {
            if (collection.length === 0) {
                Job.create({
                    title: "Cook",
                    description: "You will be making bagels"
                });
                Job.create({
                    title: "Waiter",
                    description: "You will be serving food"
                });
                Job.create({
                    title: "Programmer",
                    description: "You will be mindlessly typing code"
                });
                Job.create({
                    title: "Game Tester",
                    description: "You will be testing games endlessly"
                });
                Job.create({
                    title: "Game Tester",
                    description: "You will be testing games endlessly"
                });
                Job.create({
                    title: "Axe Maker",
                    description: "We need many axes made...so many..."
                }, resolve);
            }
        });
    });

};