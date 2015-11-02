(function () {
    "use strict";

    angular.module("psJwtApp")
        .controller("LoginCtrl", ["$scope", "alert", "$state", "$auth", function ($scope, alert, $state, $auth) {
            $scope.login = function () {
                $auth.login({
                        email: $scope.email,
                        password: $scope.password
                    })
                    .then(function (res) {
                        $state.go("main");
                        var message = "Thanks for coming back!";

                        if (!res.data.user.active) {
                            message = "Just a reminder, please active your account soon :)";
                        }

                        alert("success", "Welcome " + res.data.user.email + "! " + message);
                    })
                    .catch(handleError);
            };

            $scope.authenticate = function (provider) {
                $auth.authenticate(provider).then(function (res) {
                    $state.go("main");
                    var message = "Thanks for coming back!";
                    if (!res.data.user.active) {
                        message = "Just a reminder, please active your account soon :)";
                    }
                    alert("success", "Welcome " + res.data.user.displayName + "! " + message);
                }, handleError);
            };

            function handleError(err) {
                alert("warning", "Something went wrong :( ", err.data.message);
            }
    }]);
}());