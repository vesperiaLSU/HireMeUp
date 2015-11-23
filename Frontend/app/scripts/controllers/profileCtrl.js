(function() {
    "use strict";

    angular.module("jobFinder.app").controller("ProfileCtrl", [
        "$rootScope",
        "dataTransfer",
        "jobService",
        "alertService",
        "userService",
        "jobModalService",
        "confirmModalService",
        "userModalService",
        "$state",
        "userStorage",
        "jobsViewed",
        "jobsMarked",
        "jobsApplied",
        "jobsPosted",
        userProfileController
    ]);

    function userProfileController($rootScope, dataTransfer, jobService, alertService, userService,
        jobModalService, confirmModalService, userModalService, $state, userStorage, jobsViewed, jobsMarked, jobsApplied, jobsPosted) {
        var vm = this;
        var user = userStorage.getUser();
        var emailName = user.email.substring(0, user.email.indexOf('@'));
        $rootScope.bodyStyle = "";
        vm.jobsViewed = jobsViewed;
        vm.jobsMarked = jobsMarked;
        vm.jobsApplied = jobsApplied;
        vm.jobsPosted = jobsPosted.length > 11 ? jobsPosted.slice(0, 11) : jobsPosted;
        vm.email = user.email;
        vm.displayName = user.displayName ? user.displayName : emailName;
        vm.status = user.active ? "activated" : "unactivated";
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
                console.log("success");
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

        vm.deleteJob = function(job) {
            vm.id = job._id;
            vm.title = job.title;
            vm.company = job.company;
        };

        vm.editJob = function(job) {
            vm.id = job._id;
            vm.title = job.title;
            vm.company = job.company;
            vm.description = job.description;
        };

        vm.openModal = function(type) {
            var user = userStorage.getUser();
            if (user) {
                switch (type) {
                    case 'VIEW':
                        {
                            vm.hasApplied = user && vm.candidates.indexOf(user._id) !== -1;
                            jobModalService.open(type, vm);
                        }
                        break;
                    case 'POST':
                        jobModalService.open(type, vm);
                        break;
                    case 'EDIT':
                        jobModalService.open(type, vm);
                        break;
                    case 'CONFIRM':
                        confirmModalService.open(type, vm);
                        break;
                    case 'USER':
                        userModalService.open(type, vm);
                        break;
                }
            }
        };

        vm.searchJob = function search() {
            dataTransfer.addJob(vm.jobToSearch);
            $state.go("jobs");
        };
    }
}());
