(function() {
    'use strict';

    angular.module('common.service').service('paginateJobsService',
        function(dataTransfer) {
            this.paginateJobs = function(scope, jobs) {
                scope.allJobs = jobs;
                scope.numOfJob = jobs.length;
                scope.currentPage = 1;
                scope.itemsPerPage = 12;
                var begin, end, resultFound;
                if (scope.jobToSearch) {
                    dataTransfer.clearJob();
                    resultFound = $.grep(scope.allJobs, function(item) {
                        return item.title.toLowerCase().indexOf(scope.jobToSearch.toLowerCase()) !== -1;
                    });
                    scope.numOfJob = resultFound.length;
                    if (resultFound.length > 10) {
                        begin = (scope.currentPage - 1) * scope.itemsPerPage;
                        end = begin + scope.itemsPerPage;
                        scope.jobs = resultFound.slice(begin, end);
                    }
                    else {
                        scope.jobs = resultFound;
                    }
                }
                else {
                    scope.jobs = scope.allJobs;
                    if (scope.jobs.length > 10) {
                        begin = (scope.currentPage - 1) * scope.itemsPerPage;
                        end = begin + scope.itemsPerPage;
                        scope.jobs = scope.allJobs.slice(begin, end);
                    }
                }

                return resultFound;
            };

            this.paginateViewed = function(vm, jobsViewed) {
                vm.jobsViewed = jobsViewed;
                vm.numOfJob = jobsViewed.length;
                if (vm.numOfJob > 11) {
                    var begin = (vm.currentPage - 1) * vm.itemsPerPage;
                    var end = begin + vm.itemsPerPage;
                    vm.jobsViewed = jobsViewed.slice(begin, end);
                }
            };

            this.paginateMarked = function(vm, jobsMarked) {
                vm.jobsMarked = jobsMarked;
                vm.numOfJob = jobsMarked.length;
                if (vm.numOfJob > 11) {
                    var begin = (vm.currentPage - 1) * vm.itemsPerPage;
                    var end = begin + vm.itemsPerPage;
                    vm.jobsMarked = jobsMarked.slice(begin, end);
                }
            };

            this.paginateApplied = function(vm, jobsApplied) {
                vm.jobsApplied = jobsApplied;
                vm.numOfJob = jobsApplied.length;
                if (vm.numOfJob > 11) {
                    var begin = (vm.currentPage - 1) * vm.itemsPerPage;
                    var end = begin + vm.itemsPerPage;
                    vm.jobsApplied = jobsApplied.slice(begin, end);
                }
            };

            this.paginatePosted = function(vm, jobsPosted) {
                vm.numOfJobPosted = jobsPosted.length;
                vm.jobsPosted = jobsPosted;
                if (vm.numOfJobPosted > 10) {
                    var begin = (vm.currentPageJobPosted - 1) * vm.jobPostedPerPage;
                    var end = begin + vm.jobPostedPerPage;
                    vm.jobsPosted = jobsPosted.slice(begin, end);
                }
            };
        });
}());
