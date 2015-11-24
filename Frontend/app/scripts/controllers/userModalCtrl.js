(function() {
    "use strict";

    angular.module("jobFinder.app").controller("userModalCtrl", ["$scope", "$uibModalInstance", "user", function($scope, $uibModalInstance, user) {
        $scope.modalTitle = "User Profile";
        $scope.email = user.email;
        $scope.username = user.name;
        $scope.avatar_url = user.avatar_url;
        $scope.buttonType = "UPDATE"

        $scope.update = function() {
            $uibModalInstance.close({
                email: $scope.email,
                displayName: $scope.username,
                avatar_url: $scope.avatar_url
            });
        };

        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };

    }]);
}());