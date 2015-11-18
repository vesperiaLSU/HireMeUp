(function() {
    "use strict";

    angular.module("jobFinder.app").controller("ProfileCtrl", ["$rootScope", "$scope", "dataTransfer", "jobIdService", "alertService",
        function($rootScope, $scope, dataTransfer, jobIdService, alertService) {
            $rootScope.bodyStyle = "";
            
            var user = dataTransfer.getUser();
            var viewed = user.jobsViewed;
            var applied = user.jobsApplied;
            var marked = user.jobsMarked;
            
            $.each(viewed, function(index, value){
                jobIdService.get({id: value}).$promise.then(function(job){
                    debugger;
                    $scope.jobsViewed.push(job);
                })
            })

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
