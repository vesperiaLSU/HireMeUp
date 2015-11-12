(function() {
  "use strict";

  angular.module("jobFinder.app").controller("JobsCtrl", ["$scope", "jobService", "alertService", "$rootScope", "dataTransfer",
    function($scope, jobService, alertService, $rootScope, dataTransfer) {
      $rootScope.bodyStyle = "";
      var title = dataTransfer.getJob();
      var allJobs = {};

      $scope.$watch("jobToSearch", function(newValue, oldValue) {
        if (newValue === oldValue) return;
        search();
      });

      jobService.query({}).$promise.then(
        function(data) {
          allJobs = data;
          if (title) {
            dataTransfer.clearJob();
            $scope.jobToSearch = title;
            $scope.jobs = $.grep(allJobs, function(item) {
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

      $scope.searchJob = search();

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

      function search() {
        var jobTitle = $scope.jobToSearch;
        jobService.query({
          title: jobTitle
        }).$promise.then(
          function(data) {
            $scope.jobs = data;
          },
          function(error) {
            alertService("warning", "Unable to get jobs: ", error.data.message, "job-alert");
          });
      }
    }
  ]);
}());
