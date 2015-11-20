(function() {
    "use strict";

    angular.module("common.service").service("userModalService", function($uibModal, $auth, jobService, alertService, $state, applyForJobService, postJobService, deleteJobService) {
        this.open = function(type, scope) {
            $("body").css('overflow-y', 'scroll');
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: '/app/views/userModal.html',
                controller: 'userModalCtrl',
                size: 'md',
                backdrop: 'static',
                keyboard: false,
                windowClass: 'custom-modal',
                resolve: {
                    user: {
                        email: scope.email,
                        name: scope.displayName,
                        password: scope.password,
                        avatar_url: scope.avatar_url
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