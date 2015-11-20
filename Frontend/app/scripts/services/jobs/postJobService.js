(function() {
    'use strict';
    angular.module("common.service").service("postJobService", function(userStorage, userService, alertService, $state, jobService) {
        this.post = function(job, scope) {
            var user = userStorage.getUser();
            if (user) {
                jobService.title.save(job).$promise.then(function(data) {
                    if ($state.current.url === "/jobs") {
                        scope.jobs = scope.allJobs;
                        scope.jobs.push(data);
                        scope.numOfJob = scope.jobs.length;
                    }
                    else {
                        $state.go("jobs");
                    }
                    user.jobsPosted.push(data._id);
                    userService.update({
                        id: user._id
                    }, user).$promise.then(function(user) {
                        userStorage.setUser(user);
                        alertService("success", "You succesfully post job: ", job.title, "job-alert");
                    }).catch(function(error) {
                        alertService('warning', 'Opps!', 'Error updating user with: ' + job.title + " to jobs posted", 'job-alert');
                    });
                }, function(error) {
                    alertService("warning", "Error: ", "Job saving failed", "job-alert");
                });
            }
            else {
                $state.go("login");
                alertService("warning", "Opps! ", "To apply for a job, you need to sign in first", "main-alert");
            }
        };
    });
}());