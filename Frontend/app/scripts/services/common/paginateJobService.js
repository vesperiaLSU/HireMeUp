(function() {
    'use strict';

    angular.module('common.service').service('paginateJobsService', function(dataTransfer) {
        this.paginateJobs = function(scope, jobs) {
            scope.allJobs = jobs;
            scope.numOfJob = jobs.length;
            scope.currentPage = 1;
            scope.itemsPerPage = 10;
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
            vm.currentPage = 1;
            vm.numOfJob = jobsViewed.length;
            vm.jobsViewed = jobsViewed;
            if (jobsViewed.length > 11) {
                var begin = (vm.currentPage - 1) * vm.itemsPerPage;
                var end = begin + vm.itemsPerPage;
                vm.jobsViewed = jobsViewed.slice(begin, end);
            }
        };

        this.paginateMarked = function(vm, jobsMarked) {
            vm.currentPage = 1;
            vm.numOfJob = jobsMarked.length;
            vm.jobsMarked = jobsMarked;
            if (jobsMarked.length > 11) {
                var begin = (vm.currentPage - 1) * vm.itemsPerPage;
                var end = begin + vm.itemsPerPage;
                vm.jobsMarked = jobsMarked.slice(begin, end);
            }
        };

        this.paginateApplied = function(vm, jobsApplied) {
            vm.currentPage = 1;
            vm.numOfJob = jobsApplied.length;
            vm.jobsApplied = jobsApplied;
            if (jobsApplied.length > 11) {
                var begin = (vm.currentPage - 1) * vm.itemsPerPage;
                var end = begin + vm.itemsPerPage;
                vm.jobsApplied = jobsApplied.slice(begin, end);
            }
        };
    });
}());
