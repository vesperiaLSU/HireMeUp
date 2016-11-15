(function() {
    "use strict";

    angular.module("jobFinder.app")
        .controller("RegisterCtrl", ["$rootScope", "$scope", "alertService", "$auth", "$state", "userStorage",
            function($rootScope, $scope, alertService, $auth, $state, userStorage) {
                $rootScope.bodyStyle = "mainPage";
                $scope.submitRegistration = function() {
                    $auth.signup({
                            email: $scope.email,
                            password: $scope.password
                        })
                        .then(function(res) {
                            $state.go("main");
                            $auth.setToken(res.data.token);
                            userStorage.setUser(res.data.user);
                            alertService('success', 'Account Created! ', "Welcome, " + res.data.user.email + " Just a reminder, please active your account soon :)", "main-alert");
                        })
                        .catch(function(err) {
                            alertService('warning', 'Opps! ', 'Could not register: ' + err.data.message, "main-alert");
                        });
                };

                $scope.authenticate = function(provider) {
                    $auth.authenticate(provider).then(function(res) {
                        $state.go("main");
                        userStorage.setUser(res.data.user);
                        var message = "Thanks for coming back!";
                        if (!res.data.user.active) {
                            message = "Just a reminder, please active your account soon :)";
                        }
                        alertService("success", "Welcome ", res.data.user.displayName + "! " + message, "main-alert");
                    }, handleError);
                };

                function handleError(err) {
                    alertService("warning", "Something went wrong :( ", err.data.message, "main-alert");
                }
            }
        ]);
}());