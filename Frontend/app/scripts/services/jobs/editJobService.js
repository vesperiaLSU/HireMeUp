(function() {
    'use strict';
    angular.module("common.service").service("editJobService", ["userStorage", "alertService", "$state", "jobService",
        function(userStorage, alertService, $state, jobService) {
            this.edit = function(job, scope) {
                var user = userStorage.getUser();
                if (user) {
                    jobService.jobId.update({
                        id: job._id
                    }, job).$promise.then(function(data) {
                        $.each(scope.jobsViewed, function(index, item) {
                            if (item._id === data._id) {
                                item.title = data.title;
                                item.company = data.company;
                                item.description = data.description;
                            }
                        });
                        $.each(scope.jobsMarked, function(index, item) {
                            if (item._id === data._id) {
                                item.title = data.title;
                                item.company = data.company;
                                item.description = data.description;
                            }
                        });
                        $.each(scope.jobsApplied, function(index, item) {
                            if (item._id === data._id) {
                                item.title = data.title;
                                item.company = data.company;
                                item.description = data.description;
                            }
                        });
                        $.each(scope.jobsPosted, function(index, item) {
                            if (item._id === data._id) {
                                item.title = data.title;
                                item.company = data.company;
                                item.description = data.description;
                            }
                        });
                        alertService("success", "You successfully updated the job: ", data.title, "main-alert");
                    }).catch(function(error) {
                        alertService("warning", "Opps! ", "Failed to edit job: " + job.title, "main-alert");
                    });
                }
                else {
                    $state.go("login");
                    alertService("warning", "Opps! ", "To edit a job, you need to sign in first", "main-alert");
                }
            };
        }
    ]);
}());