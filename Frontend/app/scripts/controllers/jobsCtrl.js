(function() {
  "use strict";

  angular.module("jobFinder.app").controller("JobsCtrl", ["$scope", "jobService", "alertService", "$rootScope", "jobTransfer",
    function($scope, jobService, alertService, $rootScope, jobTransfer) {
      $rootScope.bodyStyle = "";
      var searchResult = jobTransfer.getJobFromList();
      debugger;
      if (searchResult.length > 0) {
        $scope.jobs = jobTransfer.getJobFromList();
      }
      else {
        jobService.query({}).$promise.then(
          function(data) {
            $scope.jobs = data;
          },
          function(error) {
            alertService("warning", "Unable to get jobs: ", error.data.message, "job-alert");
          });
      }

      $scope.searchJob = function() {
        var jobTitle = $scope.jobToSearch;
        jobService.query({
          title: jobTitle
        }).$promise.then(
          function(data) {
            debugger;
            $scope.jobs = data;
          },
          function(error) {
            debugger;
            $scope.jobs = null;
            alertService("warning", "Unable to get jobs: ", error.data.message, "job-alert");
          });
      }

      $scope.postJob = function() {
        jobService.save({
          title: $scope.jobTitle,
          description: $scope.description,
          company: $scope.company
        }).$promise.then(function() {
          $scope.jobs.push({
            title: $scope.title,
            description: $scope.description,
            company: $scope.company
          });
          alertService("success", "New job added: ", $scope.title, "job-alert");
        }, function(error) {
          alertService("warning", "Error: ", "Job saving failed", "job-alert");
        });
      }
    }
  ]);
}());
