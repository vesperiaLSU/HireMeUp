(function() {
    "use strict";

    angular.module("common.service").service("jobModalService", ["$uibModal", "$auth", "jobService", "alertService", "$state", "applyForJobService", "postJobService", "deleteJobService", "editJobService",
        function($uibModal, $auth, jobService, alertService, $state, applyForJobService, postJobService, deleteJobService, editJobService) {
            this.open = function(type, scope) {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: '/app/views/jobModal.html',
                    controller: 'JobModalCtrl',
                    size: 'md',
                    backdrop: 'static',
                    keyboard: false,
                    windowClass: 'custom-modal',
                    openedClass: 'always-scroll',
                    resolve: {
                        config: function() {
                            return renderModalConfig(type, scope);
                        }
                    }
                });

                modalInstance.result.then(function(job) {
                        switch (job.type) {
                            case 'SUBMIT':
                                {
                                    if ($auth.isAuthenticated()) {
                                        postJobService.post(job, scope);
                                    }
                                    else {
                                        $state.go("login");
                                        alertService("warning", "Opps! ", "To post a job, you need to sign in first", "main-alert");
                                    }
                                }
                                break;
                            case 'APPLY':
                                {
                                    if ($auth.isAuthenticated()) {
                                        applyForJobService.apply(job);
                                    }
                                    else {
                                        $state.go("login");
                                        alertService("warning", "Opps! ", "To apply for a job, you need to sign in first", "main-alert");
                                    }
                                }
                                break;
                            case 'SAVE':
                                {
                                    if ($auth.isAuthenticated()) {
                                        editJobService.edit(job, scope);
                                    }
                                    else {
                                        $state.go("login");
                                        alertService("warning", "Opps! ", "To edit a job, you need to sign in first", "main-alert");
                                    }
                                }
                                break;
                        }
                    },
                    function() {
                        console.log('Modal dismissed at: ' + new Date());
                    });
            };

            function renderModalConfig(type, scope) {
                switch (type) {
                    case 'POST':
                        return {
                            modalTitle: 'Post a Job',
                            isEditable: true,
                            buttonType: 'SUBMIT'
                        };
                    case 'VIEW':
                        return {
                            id: scope.id,
                            title: scope.title,
                            company: scope.company,
                            description: scope.description,
                            views: scope.views,
                            applicants: scope.applicants,
                            modalTitle: "View Job",
                            isEditable: false,
                            hasApplied: scope.hasApplied,
                            buttonType: scope.hasApplied ? "APPLIED" : "APPLY",
                            candidates: scope.candidates
                        };
                    case 'EDIT':
                        return {
                            id: scope.id,
                            title: scope.title,
                            company: scope.company,
                            description: scope.description,
                            modalTitle: "Edit Job",
                            isEditable: true,
                            buttonType: "SAVE"
                        };
                }
            }
        }
    ]);
}());