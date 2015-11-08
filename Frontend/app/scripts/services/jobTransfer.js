(function() {
    angular.module("common.service").factory("jobTransfer", function($resource) {
        var jobList = [];
        var addJobToList = function(jobs){
            jobList = jobs;
        };
        var getJobFromList = function(){
            return jobList;
        };
        
        return {
            addJobToList: addJobToList,
            getJobFromList: getJobFromList
        };
    });
}());
