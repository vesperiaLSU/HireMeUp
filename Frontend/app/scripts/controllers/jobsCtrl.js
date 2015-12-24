(function() {
  "use strict";

  angular.module("jobFinder.app").controller("JobsCtrl", ["$scope", "jobService", "userService", "alertService", "$rootScope", "dataTransfer",
    "$state", "$uibModal", "jobModalService", "applyForJobService", "userStorage", "jobs", "paginateJobsService", "_",
    function($scope, jobService, userService, alertService, $rootScope, dataTransfer,
      $state, $uibModal, jobModalService, applyForJobService, userStorage, jobs, paginateJobsService, _) {
      $rootScope.bodyStyle = "";
      $scope.jobToSearch = dataTransfer.getJob();
      var resultFound;
      
      $scope.$watch("jobToSearch", function(newValue, oldValue) {
        if (newValue === oldValue) return;
        search();
      });

      if (jobs.length === 0) {
        alertService("warning", "Opps! ", "No job found", "job-alert");
      }
      else {
        resultFound = paginateJobsService.paginateJobs($scope, jobs);
      }

      var user = userStorage.getUser();
      changeJobStatus();

      $scope.pageChanged = function() {
        if (resultFound && resultFound.length > 10) {
          begin = ($scope.currentPage - 1) * $scope.itemsPerPage;
          end = begin + $scope.itemsPerPage;
          $scope.jobs = resultFound.slice(begin, end);
        }
        else {
          var begin = ($scope.currentPage - 1) * $scope.itemsPerPage;
          var end = begin + $scope.itemsPerPage;
          $scope.jobs = $scope.allJobs.slice(begin, end);
        }
      };

      $scope.viewJob = function(job) {
        $scope.id = job._id;
        $scope.title = job.title;
        $scope.company = job.company;
        $scope.description = job.description;
        $scope.views = job.views;
        $scope.applicants = job.applicants;
        $scope.candidates = job.candidates;

        job.views++;
        jobService.jobId.update({
          id: $scope.id
        }, job).$promise.then(function(data) {
          //do nothing
        }).catch(function(error) {
          job.views -= 1;
          alertService('warning', 'Opps! ', 'Error increasing the job view for : ' + $scope.title, 'job-alert');
        });

        var user = userStorage.getUser();
        if (user && user.jobsViewed.indexOf($scope.id) === -1) {
          user.jobsViewed.push($scope.id);
          userService.update({
            id: user._id
          }, user).$promise.then(function(user) {
            userStorage.setUser(user);
          }).catch(function(error) {
            alertService('warning', 'Opps! ', 'Error adding: ' + $scope.title + " to jobs viewed", 'job-alert');
          });
        }
      };

      $scope.openModal = function(type) {
        var user = userStorage.getUser();
        if (type === 'VIEW' && user) {
          $scope.hasApplied = user && $scope.candidates.indexOf(user._id) !== -1;
        }
        jobModalService.open(type, $scope);
      };

      $scope.markJob = function(job) {
        var user = userStorage.getUser();
        if (user) {
          var index = user.jobsMarked.indexOf(job._id);
          if (index === -1) {
            user.jobsMarked.push(job._id);
            userService.update({
              id: user._id
            }, user).$promise.then(function(user) {
              userStorage.setUser(user);
              alertService("success", "You succesfully bookmarked: ", job.title, "job-alert");
            }).catch(function(error) {
              alertService('warning', 'Opps! ', 'Error adding: ' + job.title + " to bookmarked", 'job-alert');
            });
          }
          else {
            user.jobsMarked.splice(index, 1);
            userService.update({
              id: user._id
            }, user).$promise.then(function(user) {
              userStorage.setUser(user);
              alertService("success", "You succesfully un-bookmarked: ", job.title, "job-alert");
            }).catch(function(error) {
              alertService('warning', 'Opps! ', 'Error adding: ' + job.title + " to bookmarked", 'job-alert');
            });
          }
        }
        else {
          $state.go("login");
          alertService("warning", "Opps! ", "To bookmark a job, you need to sign in first", "main-alert");
        }
      };

      $scope.applyJob = function(job) {
        applyForJobService.apply(job);
      };

      $scope.refresh = function() {
        jobService.title.query({}).$promise.then(function(jobs) {
          if (jobs.length === 0) {
            alertService("warning", "Opps! ", "No job found", "job-alert");
          }
          else {
            $scope.jobToSearch = "";
            paginateJobsService.paginateJobs($scope, jobs);
            changeJobStatus();
          }

        }).catch(function(err) {
          alertService("warning", "Unable to get jobs: " + err, "job-alert");
        });
      };

      $scope.searchJob = search;

      function search() {
        jobService.title.query({
          title: $scope.jobToSearch
        }).$promise.then(
          function(data) {
            resultFound = paginateJobsService.paginateJobs($scope, data);
            changeJobStatus();
          },
          function(error) {
            alertService("warning", "Unable to get jobs: ", error.data.message, "job-alert");
          });
      }

      function changeJobStatus() {
        if (user) {
          $.each($scope.jobs, function(index, job) {
            if (_.contains(user.jobsMarked, job._id)) {
              job.marked = true;
            }
            else {
              job.marked = false;
            }

            if (_.contains(user.jobsApplied, job._id)) {
              job.applied = true;
            }
            else {
              job.applied = false;
            }
          });
        }
        else {
          $.each($scope.jobs, function(index, job) {
            job.marked = false;
            job.applied = false;
          });
        }
      }
    }
  ]);
})();