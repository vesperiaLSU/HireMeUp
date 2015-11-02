(function() {
  "use strict";

  angular.module("psJwtApp").controller("JobsCtrl", ["$scope", "$http", "API_URL", "alert", "$resource",
    function($scope, $http, API_URL, alert, $resource) {
      $http.get(API_URL + "jobs").success(function(jobs) {
        $scope.jobs = jobs;
      }).error(function(err) {
        alert("warning", "Unable to get jobs!!", err.message);
      });

      var resource = $resource("/api/jobs");

      $scope.jobs = resource.query();

      $scope.submit = function() {
        resource.save({
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
