(function() {
    "use strict";

    angular.module("jobFinder.app")
        .controller("RegisterCtrl", ["$rootScope", "$scope", "alertService", "$auth", "$state",
            function($rootScope, $scope, alertService, $auth, $state) {
                $rootScope.bodyStyle = "mainPage";
                $scope.submitRegistration = function() {
                    $auth.signup({
                            email: $scope.email,
                            password: $scope.password
                        })
                        .then(function(res) {
                            $state.go("main");
                            $auth.setToken(res.data.token);
                            debugger;
                            alertService('success', 'Account Created! ', "Welcome, " + res.data.user.email + "Just a reminder, please active your account soon :)", "main-alert");
                        })
                        .catch(function(err) {
                            debugger;
                            alertService('warning', 'Opps! ', 'Could not register: ' + err.data.message, "main-alert");
                        });
                };
            }
        ]);
}());