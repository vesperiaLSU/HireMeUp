(function() {
    "use strict";

    angular.module("jobFinder.app").controller("ProfileCtrl", ["$rootScope", "$scope", "dataTransfer", "jobService", "alertService", "userService", "jobModalService",
        function($rootScope, $scope, dataTransfer, jobService, alertService, userService, jobModalService) {
            $rootScope.bodyStyle = "";
            var user = dataTransfer.getUser();
            var viewed = user.jobsViewed;
            var applied = user.jobsApplied;
            var marked = user.jobsMarked;

            $scope.jobsViewed = [];
            $scope.jobsMarked = [];
            $scope.jobsApplied = [];

            $.each(viewed, function(index, value) {
                jobService.jobId.get({
                    id: value
                }).$promise.then(function(job) {
                    $scope.jobsViewed.push(job);
                });
            });

            $.each(applied, function(index, value) {
                jobService.jobId.get({
                    id: value
                }).$promise.then(function(job) {
                    $scope.jobsApplied.push(job);
                });
            });

            $.each(marked, function(index, value) {
                jobService.jobId.get({
                    id: value
                }).$promise.then(function(job) {
                    $scope.jobsMarked.push(job);
                });
            });

            $scope.viewJob = function(job) {
                $scope.id = job._id;
                $scope.title = job.title;
                $scope.company = job.company;
                $scope.description = job.description;
                $scope.views = job.views;
                $scope.applicants = job.applicants;
                $scope.candidates = job.candidates;

                job.views++;
                jobService.jobId.update({
                    id: $scope.id
                }, job).$promise.then(function(data) {
                    //do nothing
                }).catch(function(error) {
                    job.views -= 1;
                    alertService('warning', 'Opps! ', 'Error increasing the job view for : ' + $scope.title, 'job-alert');
                });

                var user = dataTransfer.getUser();
                if (user && user.jobsViewed.indexOf($scope.id) === -1) {
                    user.jobsViewed.push($scope.id);
                    userService.update({
                        id: user._id
                    }, user).$promise.then(function(user) {
                        dataTransfer.updateUser(user);
                    }).catch(function(error) {
                        alertService('warning', 'Opps! ', 'Error adding: ' + $scope.title + " to jobs viewed", 'job-alert');
                    });
                }
            };

            $scope.openJobModal = function(type) {
                var user = dataTransfer.getUser();
                $scope.hasApplied = user && $scope.candidates.indexOf(user._id) !== -1;
                jobModalService.open(type, $scope);
            };

            // $scope.editJob = function(job) {
            //     $scope.id = job._id;
            //     $scope.title = job.title;
            //     $scope.company = job.company;
            //     $scope.description = job.description;
            //     $scope.modalTitle = "Edit Job";
            //     $scope.isEditable = true;
            //     $scope.buttonType = "UPDATE";

            // };

            // $scope.copyJob = function(job) {
            //     $scope.id = job._id;
            //     $scope.title = job.title;
            //     $scope.company = job.company;
            //     $scope.description = job.description;
            //     $scope.modalTitle = "Post a Job";
            //     $scope.isEditable = true;
            //     $scope.buttonType = "SUBMIT";
            // };

            // $scope.deleteJob = function(job) {
            //     $scope.id = job._id;
            //     jobIdService.delete({
            //         id: job._id
            //     }).$promise.then(function(job) {
            //         console.log(job + "deleted");
            //     }, function(error) {
            //         alertService("warning", "Error: ", "Job deleting failed", "job-alert");
            //     });
            // };

        }
    ]);
}());
