(function() {
    'use strict';
    angular.module("common.service").service("applyForJobService", ["userStorage", "userService", "alertService", "$state", "jobService",
        function(userStorage, userService, alertService, $state, jobService) {
            this.apply = function(job) {
                var user = userStorage.getUser();
                if (user) {
                    if (job.candidates.indexOf(user._id) === -1) {
                        job.candidates.push(user._id);
                        jobService.jobId.update({
                            id: job._id
                        }, job).$promise.then(function(data) {
                            console.log("success");
                        }, function(error) {
                            alertService("warning", "Opps! ", "Applying for job " + job.title + " failed!", "job-alert");
                        });
                    }
                    else {
                        alertService('warning', 'Opps! ', 'You already have applied for: ' + job.title, 'job-alert');
                        return;
                    }

                    if (user.jobsApplied.indexOf(job._id) === -1) {
                        user.jobsApplied.push(job._id);
                        userService.update({
                            id: user._id
                        }, user).$promise.then(function(user) {
                            userStorage.setUser(user);
                            alertService("success", "You succesfully applied for: ", job.title, "job-alert");
                        }).catch(function(error) {
                            alertService('warning', 'Opps! ', 'Error adding: ' + job.title + " to jobs applied", 'job-alert');
                        });
                        increaseJobApplicant(job);
                    }
                    else {
                        alertService('warning', 'Opps! ', 'You already have applied for: ' + job.title, 'job-alert');
                        return;
                    }
                }
                else {
                    $state.go("login");
                    alertService("warning", "Opps! ", "To apply for a job, you need to sign in first", "main-alert");
                }
            };

            function increaseJobApplicant(job) {
                job.applicants++;
                jobService.jobId.update({
                    id: job._id
                }, job).$promise.then(function(data) {
                    console.log("success");
                }, function(error) {
                    alertService("warning", "Opps! ", "Applying for job " + job.title + " failed!", "job-alert");
                });
            }
        }
    ]);
})();