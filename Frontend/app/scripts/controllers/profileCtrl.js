$scope.editJob = function(job) {
    id = job._id;
    title = job.title;
    company = job.company;
    description = job.description;
    modalTitle = "Edit Job";
    isEditable = true;
    buttonType = "UPDATE";

};

$scope.copyJob = function(job) {
    id = job._id;
    title = job.title;
    company = job.company;
    description = job.description;
    modalTitle = "Post a Job";
    isEditable = true;
    buttonType = "SUBMIT";
};

$scope.deleteJob = function(job) {
    id = job._id;
    jobIdService.delete({
        id: job._id
    }).$promise.then(function(job) {
        console.log(job + "deleted");
    }, function(error) {
        alertService("warning", "Error: ", "Job deleting failed", "job-alert");
    });
};