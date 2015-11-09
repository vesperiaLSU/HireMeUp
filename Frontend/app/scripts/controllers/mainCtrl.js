(function() {
    "use strict";

    angular.module("jobFinder.app").controller("MainCtrl", ["$rootScope", "$scope", "jobService", "alertService", "$state", "jobTransfer",
        function($rootScope, $scope, jobService, alertService, $state, jobTransfer) {
            $rootScope.bodyStyle = "mainPage";
            $scope.searchJob = function() {
                var jobTitle = $scope.jobToSearch;
                jobService.query({
                    title: jobTitle
                }).$promise.then(
                    function(data) {
                        debugger;
                        jobTransfer.addJobToList(data);
                        $state.go("jobs");
                    },
                    function(error) {
                        debugger;
                        $scope.jobs = null;
                        alertService("warning", "Unable to get jobs: ", error.data.message, "job-alert");
                    });
            }
        }
    ]);
}());