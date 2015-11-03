(function() {
  "use strict";

  angular.module("jobFinder.app").controller("JobsCtrl", ["$scope", "jobService", "alertService",
    function($scope, jobService, alertService) {
      jobService.query().$promise.then(
        function(data) {
          debugger;
          $scope.jobs = data;
        },
        function(error) {
          alertService("warning", "Unable to get jobs!!", error.data.message);
        });

      $scope.submit = function() {
        jobService.save({
          title: $scope.title,
          description: $scope.description
        }, function() {
          $scope.jobs.push({
            title: $scope.title,
            description: $scope.description
          });
        });
      }
    }
  ]);
}());
