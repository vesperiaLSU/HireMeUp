var Promise = require("bluebird");
var Job = require("../../Models/Job.js");

exports.findJobs = function(query) {
    return Promise.cast(Job.find(query).exec());
}

exports.saveJob = function(job) {
    var newJob = new Job({
        title: job.title,
        description: job.description,
        company: job.company
    });
    newJob.save(function(err){
        if(err) console.log(err);
    });
}

exports.updateJob = function(current, newJob) {
    current.title = newJob.title;
    current.description = newJob.description;
    current.save();
}

exports.seedJobs = function() {
    return new Promise(function(resolve, reject) {
        Job.find({}).exec(function(err, collection) {
            if (collection.length === 0) {
                Job.create({
                    title: "Cook",
                    description: "You will be making big bagels"
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
                    title: "Axe Maker",
                    description: "We need many axes made...so many..."
                }, resolve);
            }
        });
    });
};