(function () {
    "use strict";

    angular.module("psJwtApp")
        .controller("RegisterCtrl", ["$scope", "alert", "$auth", "$state", function ($scope, alert, $auth, $state) {
            $scope.submitRegistration = function () {
                $auth.signup({
                        email: $scope.email,
                        password: $scope.password
                    })
                    .then(function (res) {
                        $state.go("main");
                        $auth.setToken(res.data.token);
                        alert('success', 'Account Created! ', "Welcome, " + res.data.user.email + "Just a reminder, please active your account soon :)");
                    })
                    .catch(function (err) {
                        alert('warning', 'Opps! ', 'Could not register: ' + err.data.message);
                    });
            };
    }]);
}());