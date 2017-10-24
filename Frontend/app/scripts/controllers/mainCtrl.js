/* global angular, fbq */

(function() {
    "use strict";

    angular.module("jobFinder.app").controller("MainCtrl", ["$window", "$rootScope", "$scope", "$state", "dataTransfer", "userStorage",
        function($window, $rootScope, $scope, $state, dataTransfer, userStorage) {
            $rootScope.bodyStyle = "mainPage";
            var user = userStorage.getUser(),
                email = '';
            if (user) {
                email = user.email;
            }

            if (!$window.isInit) {
                $window.fbq('init', '503298683364175', {
                    em: email,
                });
                $window.isInit = true;
            }
            $window.fbq('track', 'PageView', {
                page: 'Home'
            });

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
}());
