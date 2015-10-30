/*global angular*/
var app = angular.module("app", ["ngResource"]);

app.controller("testCtrl", ["$scope", "$resource", function($scope, $resource) {
    var resource = $resource("/api/jobs");
    
    $scope.jobs = resource.query();
    
    $scope.submit = function(){
        resource.save({title: $scope.title, description: $scope.description}, function(){
            $scope.jobs.push({title: $scope.title, description: $scope.description});
        });
    }
}]);