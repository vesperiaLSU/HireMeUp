(function() {
    "use strict";

    angular.module("common.service").service("confirmModalService", function($uibModal, $auth, alertService, $state, deleteJobService) {
        this.open = function(type, scope) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: '/app/views/confirmModal.html',
                controller: 'confirmModalCtrl',
                size: 'md',
                backdrop: 'static',
                keyboard: false,
                windowClass: 'custom-modal',
                openedClass: 'always-scroll',
                resolve: {
                    config: {
                        id: scope.id,
                        title: scope.title,
                        company: scope.company,
                        modalTitle: "Confirmation"
                    }
                }
            });

            modalInstance.result.then(function(job) {
                    if ($auth.isAuthenticated()) {
                        deleteJobService.delete(job, scope);
                    }
                    else {
                        $state.go("login");
                        alertService("warning", "Opps! ", "To delete a job, you need to sign in first", "main-alert");
                    }
                },
                function() {
                    console.log('Modal dismissed at: ' + new Date());
                });
        };
    });
}());