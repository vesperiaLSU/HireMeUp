(function() {
    'use strict';
    angular.module("common.service").service("deleteJobService", ["userStorage", "alertService", "$state", "jobService", "userService",
        function(userStorage, alertService, $state, jobService, userService) {
            this.delete = function(job, scope) {
                var user = userStorage.getUser();
                var indexToDelete;
                if (user) {
                    jobService.jobId.delete({
                        id: job.id
                    }).$promise.then(function(deleted) {
                        scope.jobsViewed = $.grep(scope.jobsViewed, function(item) {
                            return item._id != deleted._id;
                        });
                        scope.jobsMarked = $.grep(scope.jobsMarked, function(item) {
                            return item._id != deleted._id;
                        });
                        scope.jobsPosted = $.grep(scope.jobsPosted, function(item) {
                            return item._id != deleted._id;
                        });
                        scope.jobsApplied = $.grep(scope.jobsApplied, function(item) {
                            return item._id != deleted._id;
                        });

                        if (user.jobsViewed.indexOf(deleted._id) !== -1) {
                            indexToDelete = user.jobsViewed.indexOf(deleted._id);
                            user.jobsViewed.splice(indexToDelete, 1);
                        }

                        if (user.jobsMarked.indexOf(deleted._id) !== -1) {
                            indexToDelete = user.jobsMarked.indexOf(deleted._id);
                            user.jobsMarked.splice(indexToDelete, 1);
                        }

                        if (user.jobsPosted.indexOf(deleted._id) !== -1) {
                            indexToDelete = user.jobsPosted.indexOf(deleted._id);
                            user.jobsPosted.splice(indexToDelete, 1);
                        }

                        if (user.jobsApplied.indexOf(deleted._id) !== -1) {
                            indexToDelete = user.jobsApplied.indexOf(deleted._id);
                            user.jobsApplied.splice(indexToDelete, 1);
                        }

                        userService.update({
                            id: user._id
                        }, user).$promise.then(function(user) {
                            userStorage.setUser(user);
                            alertService("success", "You successfully deleted the job: ", deleted.title, "job-alert");
                        }).catch(function(error) {
                            alertService('warning', 'Opps! ', 'Error adding: ' + job.title + " to bookmarked", 'job-alert');
                        });
                    }).catch(function(error) {
                        alertService("warning", "Opps! ", "Failed to delete job: " + job.title, "job-alert");
                    });
                }
                else {
                    $state.go("login");
                    alertService("warning", "Opps! ", "To edit a job, you need to sign in first", "main-alert");
                }
            };
        }
    ]);
})();