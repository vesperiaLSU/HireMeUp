(function() {
  "use strict";

  angular.module("jobFinder.app").controller("JobsCtrl", ["$scope", "jobService", "alertService", "$rootScope", "jobTransfer",
    function($scope, jobService, alertService, $rootScope, jobTransfer) {
      $rootScope.bodyStyle = "";
      var title = jobTransfer.getJob();
      var allJobs = {};

      jobService.query({}).$promise.then(
        function(data) {
          debugger;
          allJobs = data;
          if (title) {
            jobTransfer.clearJob();
            $scope.jobToSearch = title;
            $scope.jobs = $.grep(allJobs, function(item){
              return item.title === title;
            })
          }
          else {
            $scope.jobs = allJobs;
          }
        },
        function(error) {
          alertService("warning", "Unable to get jobs: ", error.data.message, "job-alert");
        });

      $scope.searchJob = function() {
        var jobTitle = $scope.jobToSearch;
        jobService.query({
          title: jobTitle
        }).$promise.then(
          function(data) {
            $scope.jobs = data;
          },
          function(error) {
            $scope.jobs = null;
            alertService("warning", "Unable to get jobs: ", error.data.message, "job-alert");
          });
      }

      $scope.postJob = function() {
        jobService.save({
          title: $scope.jobTitle,
          description: $scope.description,
          company: $scope.company
        }).$promise.then(function(data) {
          $scope.jobs = allJobs;
          $scope.jobs.push(data);
          alertService("success", "New job added: ", data.title, "job-alert");
        }, function(error) {
          alertService("warning", "Error: ", "Job saving failed", "job-alert");
        });
      }
    }
  ]);
}());
