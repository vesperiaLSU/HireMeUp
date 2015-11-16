(function() {
  "use strict";

  angular.module("jobFinder.app").controller("JobsCtrl", [
    "$scope",
    "titleSearch",
    "idSearch",
    "alertService",
    "$rootScope",
    "dataTransfer",
    "$auth",
    "$state",
    "$uibModal",
    function($scope, titleSearch, idSearch, alertService, $rootScope, dataTransfer, $auth, $state, $uibModal) {
      $rootScope.bodyStyle = "";
      $scope.jobToSearch = dataTransfer.getJob();
      var allJobs, id, title, company, description, views, applicants, modalTitle, isEditable, buttonType;

      $scope.$watch("jobToSearch", function(newValue, oldValue) {
        if (newValue === oldValue) return;
        search();
      });

      titleSearch.query({}).$promise.then(
        function(data) {
          allJobs = data;
          if ($scope.jobToSearch) {
            dataTransfer.clearJob();
            $scope.jobs = $.grep(allJobs, function(item) {
              return item.title === $scope.jobToSearch;
            })
          }
          else {
            $scope.jobs = allJobs;
          }
        },
        function(error) {
          alertService("warning", "Unable to get jobs: ", error.data.message, "job-alert");
        });

      $scope.searchJob = search;

      $scope.openJobModal = function(type) {
        var modalInstance = $uibModal.open({
          animation: true,
          templateUrl: '/app/views/jobModal.html',
          controller: 'JobModalCtrl',
          size: 'md',
          backdrop: 'static',
          keyboard: false,
          windowClass: 'jobModal',
          resolve: {
            config: function() {
              return renderModalConfig(type);
            }
          }
        });

        modalInstance.result.then(function(newJob) {
          if ($auth.isAuthenticated()) {
            switch (newJob.type) {
              case 'SUBMIT':
                {
                  titleSearch.save(newJob).$promise.then(function(data) {
                    $scope.jobs = allJobs;
                    $scope.jobs.push(data);
                    alertService("success", "New job added: ", data.title, "job-alert");
                  }, function(error) {
                    alertService("warning", "Error: ", "Job saving failed", "job-alert");
                  });
                }
                break;
              case 'APPLY':
                {
                  newJob.applicants++;
                  idSearch.update({
                    id: id
                  }, newJob).$promise.then(function(data) {
                    alertService("success", "You succesfully applied for: ", data.title, "job-alert");
                  }, function(error) {
                    alertService("warning", "Error: ", "Job applying failed", "job-alert");
                  });
                }
                break;
            }
          }
          else {
            $state.go("login");
            alertService("warning", "Opps! ", "To post a job, you need to sign in first", "main-alert");
          }
        }, function() {
          console.log('Modal dismissed at: ' + new Date());
        });
      }

      $scope.viewJob = function(job) {
        id = job._id;
        title = job.title;
        company = job.company;
        description = job.description;
        views = job.views;
        applicants = job.applicants;

        job.views += 1;
        idSearch.update({
          id: id
        }, job).$promise.then(function(data) {
          //do nothing
        }).catch(function(error) {
          job.views -= 1;
          alertService('warning', 'Opps!', 'Error increasing the job view for : ' + title, 'job-alert');
        });
        
        
      }

      $scope.editJob = function(job) {
        id = job._id;
        title = job.title;
        company = job.company;
        description = job.description;
        modalTitle = "Edit Job";
        isEditable = true;
        buttonType = "UPDATE";

      }

      $scope.copyJob = function(job) {
        id = job._id;
        title = job.title;
        company = job.company;
        description = job.description;
        modalTitle = "Post a Job";
        isEditable = true;
        buttonType = "SUBMIT";
      }

      $scope.deleteJob = function(job) {
        id = job._id;
        idSearch.delete({
          id: job._id
        }).$promise.then(function(job) {
          console.log(job + "deleted");
        }, function(error) {
          alertService("warning", "Error: ", "Job deleting failed", "job-alert");
        })
      }

      $scope.refresh = function() {
        $scope.jobs = allJobs;
      }



      function search() {
        titleSearch.query({
          title: $scope.jobToSearch
        }).$promise.then(
          function(data) {
            $scope.jobs = data;
          },
          function(error) {
            alertService("warning", "Unable to get jobs: ", error.data.message, "job-alert");
          });
      }

      function renderModalConfig(type) {
        switch (type) {
          case 'POST':
            return {
              modalTitle: 'Post a Job',
              isEditable: true,
              buttonType: 'SUBMIT'
            };
          case 'VIEW':
            return {
              id: id,
              title: title,
              company: company,
              description: description,
              views: views,
              applicants: applicants,
              modalTitle: "View Job",
              isEditable: false,
              buttonType: "APPLY"
            };
        }
      }
    }
  ]);
}());
