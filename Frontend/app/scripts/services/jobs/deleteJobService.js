(function() {
    'use strict';
    angular.module("common.service").service("deleteJobService", function(userStorage, alertService, $state, jobService) {
        this.delete = function(job, scope) {
            var user = userStorage.getUser();
            if (user) {
                jobService.jobId.delete({
                    id: job.id
                }).$promise.then(function(deleted){
                    alertService("success", "You successfully updated the job: ", deleted.title, "main-alert");
                }).catch(function(error) {
                    alertService("warning", "Opps! ", "Failed to edit job: " + job.title, "main-alert");
                });
            }
            else {
                $state.go("login");
                alertService("warning", "Opps! ", "To edit a job, you need to sign in first", "main-alert");
            }
        };
    });
}());