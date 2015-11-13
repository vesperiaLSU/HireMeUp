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
      $scope.title = dataTransfer.getJob();
      var allJobs = {};

      $scope.$watch("jobToSearch", function(newValue, oldValue) {
        if (newValue === oldValue) return;
        search();
      });

      titleSearch.query({}).$promise.then(
        function(data) {
          allJobs = data;
          if ($scope.title) {
            dataTransfer.clearJob();
            $scope.jobs = $.grep(allJobs, function(item) {
              return item.title === $scope.title;
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
          // if ($auth.isAuthenticated()) {
          debugger;
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
                debugger;
                idSearch.update({
                  id: $scope.id
                }, newJob).$promise.then(function(data) {
                  alertService("success", "You succesfully applied for: ", data.title, "job-alert");
                }, function(error) {
                  alertService("warning", "Error: ", "Job applying failed", "job-alert");
                });
              }
              break;
          }


          // }
          // else {
          //   $state.go("login");
          //   alertService("warning", "Opps! ", "To post a job, you need to sign in first", "main-alert");
          // }
        }, function() {
          console.log('Modal dismissed at: ' + new Date());
        });
      }

      $scope.viewJob = function(job) {
        $scope.id = job._id;
        $scope.jobTitle = job.title;
        $scope.company = job.company;
        $scope.description = job.description;

      }

      $scope.editJob = function(job) {
        $scope.id = job._id;
        $scope.jobTitle = job.title;
        $scope.company = job.company;
        $scope.description = job.description;
        $scope.modalTitle = "Edit Job";
        $scope.isEditable = true;
        $scope.buttonType = "UPDATE";

      }

      $scope.copyJob = function(job) {
        $scope.id = job._id;
        $scope.jobTitle = job.title;
        $scope.company = job.company;
        $scope.description = job.description;
        $scope.modalTitle = "Post a Job";
        $scope.isEditable = true;
        $scope.buttonType = "SUBMIT";
      }

      $scope.deleteJob = function(job) {
        $scope.id = job._id;
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

      $scope.submit = function() {
        if ($auth.isAuthenticated()) {
          titleSearch.save({
            title: $scope.jobTitle,
            description: $scope.description,
            company: $scope.company
          }).$promise.then(function(data) {
            $scope.jobs = allJobs;
            $scope.jobs.push(data);
            alertService("success", "New job added: ", data.title, "job-alert");
          }, function(error) {
            alertService("warning", "Error: ", "Job saving failed", "job-alert");
          });
        }
        else {
          $state.go("login");
          alertService("warning", "Opps! ", "To post a job, you need to sign in first", "main-alert");
        }
      }

      function search() {
        $scope.title = $scope.jobToSearch;
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
              id: $scope.id,
              title: $scope.jobTitle,
              company: $scope.company,
              description: $scope.description,
              modalTitle: "View Job",
              isEditable: false,
              buttonType: "APPLY"
            };
        }
      }
    }
  ]);
}());
