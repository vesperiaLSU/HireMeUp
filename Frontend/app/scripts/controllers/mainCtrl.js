(function() {
    "use strict";

    angular.module("jobFinder.app").controller("MainCtrl", ["$rootScope", "$scope", "$state", "jobTransfer",
        function($rootScope, $scope, $state, jobTransfer) {
            $rootScope.bodyStyle = "mainPage";
            $scope.searchJob = function() {
                jobTransfer.addJob($scope.jobToSearch);
                $state.go("jobs");
            }
        }
    ]);
}());