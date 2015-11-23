(function() {
    "use strict";

    angular.module("jobFinder.app").controller("confirmModalCtrl", ["$scope", "$uibModalInstance", "config", function($scope, $uibModalInstance, config) {
        $scope.modalTitle = "Confirmation";
        $scope.title = config.title;
        $scope.company = config.company;
        
        $scope.yes = function() {
            $uibModalInstance.close({
                id: config.id
            });
        };

        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };

    }]);
}());