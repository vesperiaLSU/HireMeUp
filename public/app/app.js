/*global angular*/
angular.module("app", ["ngResource"]);

angular.module("app").controller("testCtrl", ["$scope", "$resource", function($scope, $resource) {
    $scope.jobs = $resource("/api/jobs").query();
}]);