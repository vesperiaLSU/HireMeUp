(function() {
    "use strict";

    angular.module("jobFinder.app").controller("ProfileCtrl", ["$scope", "$rootScope", "dataTransfer", "jobService", "alertService", "userService", "jobModalService",
        "confirmModalService", "userModalService", "$state", "userStorage", "jobsViewed", "jobsMarked", "jobsApplied", "jobsPosted", "paginateJobsService",
        userProfileController
    ]);

    function userProfileController($scope, $rootScope, dataTransfer, jobService, alertService, userService, jobModalService, confirmModalService,
        userModalService, $state, userStorage, jobsViewed, jobsMarked, jobsApplied, jobsPosted, paginateJobsService) {
        var vm = this;
        var user = userStorage.getUser();
        var emailName = user.email.substring(0, user.email.indexOf('@'));
        $rootScope.bodyStyle = "";
        vm.email = user.email;
        vm.displayName = user.displayName ? user.displayName : emailName;
        vm.status = user.active ? "activated" : "unactivated";
        vm.avatar_url = user.avatar_url;
        vm.jobPostedPerPage = 10;
        vm.currentPageJobPosted = 1;
        vm.currentPage = 1;
        vm.itemsPerPage = 11;
        vm.numOfPosted = jobsPosted.length;

        paginateJobsService.paginatePosted(vm, jobsPosted);

        var currentState = $state.current.url.substring(1);
        switch (currentState) {
            case 'jobsViewed':
                paginateJobsService.paginateViewed(vm, jobsViewed);
                break;
            case 'jobsMarked':
                paginateJobsService.paginateMarked(vm, jobsMarked);
                break;
            case 'jobsApplied':
                paginateJobsService.paginateApplied(vm, jobsApplied);
                break;
            default:
                paginateJobsService.paginateViewed(vm, jobsViewed);
        }

        vm.pageChanged = function() {
            var begin, end;
            switch (currentState) {
                case 'jobsViewed':
                    {
                        if (jobsViewed.length > 11) {
                            begin = (vm.currentPage - 1) * vm.itemsPerPage;
                            end = begin + vm.itemsPerPage;
                            vm.jobsViewed = jobsViewed.slice(begin, end);
                        }
                    }
                    break;
                case 'jobsMarked':
                    {
                        if (jobsMarked.length > 11) {
                            begin = (vm.currentPage - 1) * vm.itemsPerPage;
                            end = begin + vm.itemsPerPage;
                            vm.jobsMarked = jobsMarked.slice(begin, end);
                        }
                    }
                    break;
                case 'jobsApplied':
                    {
                        if (jobsApplied.length > 11) {
                            begin = (vm.currentPage - 1) * vm.itemsPerPage;
                            end = begin + vm.itemsPerPage;
                            vm.jobsApplied = jobsApplied.slice(begin, end);
                        }
                    }
                    break;
            }

        };

        $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
            var nextState = toState.url.substring(1);
            switch (nextState) {
                case 'jobsViewed':
                    vm.numOfJob = jobsViewed.length;
                    paginateJobsService.paginateViewed(vm, jobsViewed);
                    break;
                case 'jobsMarked':
                    vm.numOfJob = jobsMarked.length;
                    paginateJobsService.paginateMarked(vm, jobsMarked);
                    break;
                case 'jobsApplied':
                    vm.numOfJob = jobsApplied.length;
                    paginateJobsService.paginateApplied(vm, jobsApplied);
                    break;
            }
        });

        vm.jobPostedPageChanged = function() {
            if (jobsPosted.length > 11) {
                var begin = (vm.currentPageJobPosted - 1) * vm.jobPostedPerPage;
                var end = begin + vm.jobPostedPerPage;
                vm.jobsPosted = jobsPosted.slice(begin, end);
            }
        };

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

        vm.clearJobMarked = function() {
            var user = userStorage.getUser();
            if (user && user.jobsMarked.length > 0) {
                user.jobsMarked.splice(0, user.jobsMarked.length);
                userService.update({
                    id: user._id
                }, user).$promise.then(function(user) {
                    vm.jobsMarked.splice(0, vm.jobsMarked.length);
                    vm.numOfJob = 0;
                    jobsMarked.splice(0, jobsMarked.length);
                    userStorage.setUser(user);
                }).catch(function(error) {
                    alertService('warning', 'Opps! ', 'Error clearing all jobs marked: ' + error.message, 'job-alert');
                });
            }
        };

        vm.clearJobViewed = function() {
            var user = userStorage.getUser();
            if (user && user.jobsViewed.length > 0) {
                user.jobsViewed.splice(0, user.jobsViewed.length);
                userService.update({
                    id: user._id
                }, user).$promise.then(function(user) {
                    vm.jobsViewed.splice(0, vm.jobsViewed.length);
                    vm.numOfJob = 0;
                    jobsViewed.splice(0, jobsViewed.length);
                    userStorage.setUser(user);
                }).catch(function(error) {
                    alertService('warning', 'Opps! ', 'Error clearing all jobs viewed: ' + error.message, 'job-alert');
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

        vm.keyPressed = function(event) {
            if (event.charCode === 13)
                vm.searchJob();
        };

        vm.searchJob = function search() {
            dataTransfer.addJob(vm.jobToSearch);
            $state.go("jobs");
        };
    }
})();
