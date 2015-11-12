(function() {
    "use strict";

    angular.module("jobFinder.app").controller("MainCtrl", ["$rootScope", "$scope", "$state", "dataTransfer",
        function($rootScope, $scope, $state, dataTransfer) {
            $rootScope.bodyStyle = "mainPage";
            $scope.searchJob = function() {
                dataTransfer.addJob($scope.jobToSearch);
                $state.go("jobs");
            }
        }
    ]);
}());