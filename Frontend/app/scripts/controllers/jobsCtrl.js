(function() {
  "use strict";

  angular.module("jobFinder.app").controller("JobsCtrl", [
    "$scope",
    "jobTitleService",
    "jobIdService",
    "userIdService",
    "alertService",
    "$rootScope",
    "dataTransfer",
    "$auth",
    "$state",
    "$uibModal",
    function($scope, jobTitleService, jobIdService, userIdService, alertService, $rootScope, dataTransfer, $auth, $state, $uibModal) {
      $rootScope.bodyStyle = "";
      $scope.jobToSearch = dataTransfer.getJob();
      var allJobs, id, title, company, description, views, applicants;

      $scope.$watch("jobToSearch", function(newValue, oldValue) {
        if (newValue === oldValue) return;
        search();
      });

      jobTitleService.query({}).$promise.then(
        function(data) {
          allJobs = data;
          if ($scope.jobToSearch) {
            dataTransfer.clearJob();
            $scope.jobs = $.grep(allJobs, function(item) {
              return item.title.toLowerCase().indexOf($scope.jobToSearch.toLowerCase()) !== -1;
            });
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
                  jobTitleService.save(newJob).$promise.then(function(data) {
                    $scope.jobs = allJobs;
                    $scope.jobs.push(data);
                    alertService("success", "New job added: ", data.title, "job-alert");
                  }, function(error) {
                    alertService("warning", "Error: ", "Job saving failed", "job-alert");
                  });
                }
                break;
              case 'APPLY':
                applyForJob(newJob);
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
      };

      $scope.viewJob = function(job) {
        id = job._id;
        title = job.title;
        company = job.company;
        description = job.description;
        views = job.views;
        applicants = job.applicants;

        job.views++;
        jobIdService.update({
          id: id
        }, job).$promise.then(function(data) {
          //do nothing
        }).catch(function(error) {
          job.views -= 1;
          alertService('warning', 'Opps!', 'Error increasing the job view for : ' + title, 'job-alert');
        });

        var user = dataTransfer.getUser();
        if (user && user.jobsViewed.indexOf(id) === -1) {
          user.jobsViewed.push(id);
          userIdService.update({
            id: user._id
          }, user).$promise.then(function(user) {
            dataTransfer.updateUser(user);
          }).catch(function(error) {
            alertService('warning', 'Opps!', 'Error adding: ' + title + " to jobs viewed", 'job-alert');
          });
        }
      };

      $scope.markJob = function(job) {
        var user = dataTransfer.getUser();
        if (user) {
          if (user.jobsMarked.indexOf(job._id) === -1) {
            user.jobsMarked.push(job._id);
            userIdService.update({
              id: user._id
            }, user).$promise.then(function(user) {
              dataTransfer.updateUser(user);
              alertService("success", "You succesfully bookmarked: ", job.title, "job-alert");
            }).catch(function(error) {
              alertService('warning', 'Opps!', 'Error adding: ' + job.title + " to bookmarked", 'job-alert');
            });
          }
          else {
            alertService('warning', 'Opps!', 'You already have bookmarked: ' + job.title, 'job-alert');
          }
        }
        else {
          $state.go("login");
          alertService("warning", "Opps! ", "To bookmark a job, you need to sign in first", "main-alert");
        }
      };

      $scope.applyJob = applyForJob;

      $scope.refresh = function() {
        $scope.jobs = allJobs;
      };

      function search() {
        jobTitleService.query({
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

      function applyForJob(job) {
        var user = dataTransfer.getUser();
        if (user) {
          if (user.jobsApplied.indexOf(job._id) === -1) {
            user.jobsApplied.push(job._id);
            userIdService.update({
              id: user._id
            }, user).$promise.then(function(user) {
              dataTransfer.updateUser(user);
              alertService("success", "You succesfully applied for: ", job.title, "job-alert");
            }).catch(function(error) {
              alertService('warning', 'Opps!', 'Error adding: ' + job.title + " to jobs applied", 'job-alert');
            });
            
            increaseJobApplicant(job);
          }
          else {
            alertService('warning', 'Opps!', 'You already have applied for: ' + job.title, 'job-alert');
          }
        }
        else {
          $state.go("login");
          alertService("warning", "Opps! ", "To apply for a job, you need to sign in first", "main-alert");
        }
      }

      function increaseJobApplicant(job) {
        job.applicants++;
        jobIdService.update({
          id: job._id
        }, job).$promise.then(function(data) {
          console.log("success");
        }, function(error) {
          alertService("warning", "Error: ", "Job applied cannot be added", "job-alert");
        });
      }
    }
  ]);
}());
