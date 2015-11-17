(function() {
    "use strict";

    angular.module("jobFinder.app")
        .controller("LoginCtrl", ["$rootScope", "$scope", "alertService", "$state", "$auth", "$window", "dataTransfer",
            function($rootScope, $scope, alertService, $state, $auth, $window, dataTransfer) {
                $rootScope.bodyStyle = "mainPage";

                $scope.login = function() {
                    $auth.login({
                            email: $scope.email,
                            password: $scope.password
                        })
                        .then(function(res) {
                            $state.go("main");
                            dataTransfer.updateUser(res.data.user);
                            var message = "Thanks for coming back!";

                            if (!res.data.user.active) {
                                message = "Just a reminder, please active your account soon :)";
                            }
                            alertService("success", "Welcome! ", res.data.user.email + "! " + message, "main-alert");
                        })
                        .catch(handleError);
                };

                $scope.authenticate = function(provider) {
                    $auth.authenticate(provider).then(function(res) {
                        $state.go("main");
                        debugger;
                        dataTransfer.updateUser(res.data.user);
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