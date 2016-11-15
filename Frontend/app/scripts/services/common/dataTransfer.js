(function() {
    "use strict";
    angular.module("common.service").factory("dataTransfer",
        function() {
            var jobTitle;
            var addJob = function(title) {
                jobTitle = title;
            }
            var getJob = function() {
                return jobTitle;
            }
            var clearJob = function() {
                jobTitle = "";
            }

            return {
                addJob: addJob,
                getJob: getJob,
                clearJob: clearJob
            };
        });
}());
