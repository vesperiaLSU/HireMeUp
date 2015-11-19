(function() {
    "use strict";

    angular.module("jobFinder.app").controller("ProfileCtrl", [
        "$rootScope",
        "dataTransfer",
        "jobService",
        "alertService",
        "userService",
        "jobModalService",
        "$state",
        "userStorage",
        "jobsViewed",
        "jobsMarked",
        "jobsApplied",
        "jobsPosted",
        userProfileController
    ]);

    function userProfileController($rootScope, dataTransfer, jobService, alertService, userService,
        jobModalService, $state, userStorage, jobsViewed, jobsMarked, jobsApplied, jobsPosted) {
        var vm = this;
        var user = userStorage.getUser();
        var emailName = user.email.substring(0, user.email.indexOf('@'));
        $rootScope.bodyStyle = "";
        vm.jobsViewed = jobsViewed;
        vm.jobsMarked = jobsMarked;
        vm.jobsApplied = jobsApplied;
        vm.jobsPosted = jobsPosted;
        vm.displayName = user.displayName ? user.displayName : emailName;
        vm.status = user.active? "activated" : "unactivated";
        vm.avatar_url = user.avatar_url;

        vm.viewJob = function(job) {
            vm.id = job._id;
            vm.title = job.title;
            vm.company = job.company;
            vm.description = job.description;
            vm.views = job.views;
            vm.applicants = job.applicants;
            vm.candidates = job.candidates;

            job.views++;
            jobService.jobId.update({
                id: vm.id
            }, job).$promise.then(function(data) {
                //do nothing
            }).catch(function(error) {
                job.views -= 1;
                alertService('warning', 'Opps! ', 'Error increasing the job view for : ' + vm.title, 'job-alert');
            });

            var user = userStorage.getUser();
            if (user && user.jobsViewed.indexOf(vm.id) === -1) {
                user.jobsViewed.push(vm.id);
                userService.update({
                    id: user._id
                }, user).$promise.then(function(user) {
                    userStorage.setUser(user);
                }).catch(function(error) {
                    alertService('warning', 'Opps! ', 'Error adding: ' + vm.title + " to jobs viewed", 'job-alert');
                });
            }
        };

        vm.openJobModal = function(type) {
            var user = userStorage.getUser();
            if (type !== 'POST' && user) {
                vm.hasApplied = user && vm.candidates.indexOf(user._id) !== -1;
            }
            jobModalService.open(type, vm);
        };

        vm.searchJob = function search() {
            dataTransfer.addJob(vm.jobToSearch);
            $state.go("jobs");
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
}());
