(function() {
    "use strict";

    angular.module("jobFinder.app")
        .controller("LoginCtrl", ["$rootScope", "$scope", "alertService", "$state", "$auth", "userStorage",
            function($rootScope, $scope, alertService, $state, $auth, userStorage) {
                $rootScope.bodyStyle = "mainPage";

                $scope.login = function() {
                    $auth.login({
                            email: $scope.email,
                            password: $scope.password
                        })
                        .then(function(res) {
                            $state.go("main");
                            userStorage.setUser(res.data.user);
                            var message = "Thanks for coming back!";
                            var username = res.data.user.displayName ? res.data.user.displayName : res.data.user.email;
                            if (!res.data.user.active) {
                                message = "Just a reminder, please active your account soon :)";
                            }

                            alertService("success", "Welcome ", username + "! " + message, "main-alert");
                        })
                        .catch(handleError);
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