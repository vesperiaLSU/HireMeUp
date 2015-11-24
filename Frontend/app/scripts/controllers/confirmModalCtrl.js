(function() {
    "use strict";

    angular.module("jobFinder.app").controller("confirmModalCtrl", ["$scope", "$uibModalInstance", "config", "userStorage", "jobModalService", "confirmModalService", function($scope, $uibModalInstance, config, userStorage, jobModalService, confirmModalService) {
        $scope.modalTitle = config.modalTitle,
        $scope.title = config.title;
        $scope.company = config.company;
        $scope.jobsPosted = config.jobsPosted;
        
        $scope.deleteJob = function(job) {
            $scope.id = job._id;
            $scope.title = job.title;
            $scope.company = job.company;
        };

        $scope.editJob = function(job) {
            $scope.id = job._id;
            $scope.title = job.title;
            $scope.company = job.company;
            $scope.description = job.description;
        };

        $scope.openModal = function(type) {
            var user = userStorage.getUser();
            if (user) {
                switch (type) {
                    case 'EDIT':
                        jobModalService.open(type, $scope);
                        break;
                    case 'CONFIRM':
                        confirmModalService.open(type, $scope);
                        break;
                }
            }
        };
        
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