(function() {
    'use strict';
    angular.module("common.service").service("deleteJobService", function(userStorage, userService, alertService, $state, jobService) {
        this.delete = function(job, scope) {
            var user = userStorage.getUser();
            if (user) {

                    jobService.jobId.delete({
                        id: job._id
                    }).$promise.then(function(data) {
                        console.log("success");
                    }, function(error) {
                        alertService("warning", "Opps! ", "Applying for job " + job.title + " failed!", "job-alert");
                    });
                

                if (user.jobsPosted.indexOf(job._id) === -1) {
                    user.jobsApplied.push(job._id);
                    userService.update({
                        id: user._id
                    }, user).$promise.then(function(user) {
                        userStorage.setUser(user);
                        alertService("success", "You succesfully applied for: ", job.title, "job-alert");
                    }).catch(function(error) {
                        alertService('warning', 'Opps!', 'Error adding: ' + job.title + " to jobs applied", 'job-alert');
                    });

                    increaseJobApplicant(job);
                }
                else {
                    alertService('warning', 'Opps!', 'You already have applied for: ' + job.title, 'job-alert');
                }
            }
            else {
                $state.go("login");
                alertService("warning", "Opps! ", "To apply for a job, you need to sign in first", "main-alert");
            }
        };
    });
}());