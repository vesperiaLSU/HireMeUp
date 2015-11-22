(function() {
    "use strict";
    var Job = require("../../Models/Job.js");

    exports.findJobs = function(query) {
        return Job.find(query).sort('title');
    };
    
    exports.findOneJob = function(query) {
        return Job.findById(query);
    };

    exports.saveJob = function(job) {
        var newJob = new Job({
            title: job.title,
            description: job.description,
            company: job.company
        });
        return newJob.saveAsync();
    };
    
    exports.deleteJob = function(id){
        return Job.findByIdAndRemoveAsync(id);
    }

    exports.updateJob = function(id, update) {
        var options = {
            new: true
        };
        return Job.findByIdAndUpdateAsync(id, update, options);
    };
}());