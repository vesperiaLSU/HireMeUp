(function() {
    "use strict";

    angular.module("jobFinder.app").controller("MainCtrl", ["$rootScope", "$scope", "$state", "dataTransfer",
        function($rootScope, $scope, $state, dataTransfer) {
            $rootScope.bodyStyle = "mainPage";
            $scope.keyPressed = function(event) {
                if (event.charCode === 13)
                    $scope.searchJob();
            };

            $scope.searchJob = function() {
                dataTransfer.addJob($scope.jobToSearch);
                $state.go("jobs");
            };
        }
    ]);
})();