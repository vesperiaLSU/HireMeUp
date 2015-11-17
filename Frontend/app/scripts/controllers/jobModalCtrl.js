(function() {
    "use strict";

    angular.module("jobFinder.app").controller("JobModalCtrl", ["$scope", "$uibModalInstance", "config", function($scope, $uibModalInstance, config) {
        $scope.modalTitle = config.modalTitle;
        $scope.buttonType = config.buttonType;
        $scope.isEditable = config.isEditable;
        $scope.title = config.title;
        $scope.company = config.company;
        $scope.description = config.description;
        
        $scope.submit = function() {
            $uibModalInstance.close({
                _id: config.id,
                title: $scope.title,
                company: $scope.company,
                description: $scope.description,
                type: $scope.buttonType,
                views: config.views,
                applicants: config.applicants
            });
        };

        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };

    }]);
}());