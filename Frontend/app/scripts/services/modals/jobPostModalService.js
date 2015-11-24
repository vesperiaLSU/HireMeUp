(function() {
    "use strict";

    angular.module("common.service").service("jobPostModalService", function($uibModal, $auth, userService, $state, alertService, userStorage) {
        this.open = function(type, scope) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: '/app/views/jobPostedModal.html',
                controller: 'confirmModalCtrl',
                size: 'md',
                backdrop: 'static',
                keyboard: false,
                windowClass: 'custom-modal',
                openedClass: 'always-scroll',
                resolve: {
                    config: {
                        modalTitle: 'Jobs Posted',
                        jobsPosted: scope.totalJobsPosted
                    }
                }
            });

            modalInstance.result.then(function(update) {
                    //do nothing
                },
                function() {
                    console.log('Modal dismissed at: ' + new Date());
                });
        };
    });
}());