(function() {
  "use strict";

  angular.module("jobFinder.app").controller("JobsCtrl", [
    "$scope",
    "jobService",
    "userService",
    "alertService",
    "$rootScope",
    "dataTransfer",
    "$auth",
    "$state",
    "$uibModal",
    "jobModalService",
    "applyForJobService",
    function($scope, jobService, userService, alertService, $rootScope, dataTransfer, $auth, $state, $uibModal, jobModalService, applyForJobService) {
      $rootScope.bodyStyle = "";
      $scope.jobToSearch = dataTransfer.getJob();

      $scope.$watch("jobToSearch", function(newValue, oldValue) {
        if (newValue === oldValue) return;
        search();
      });

      jobService.title.query({}).$promise.then(
        function(data) {
          $scope.allJobs = data;
          $scope.numOfJob = $scope.allJobs.length;
          if ($scope.jobToSearch) {
            dataTransfer.clearJob();
            $scope.jobs = $.grep($scope.allJobs, function(item) {
              return item.title.toLowerCase().indexOf($scope.jobToSearch.toLowerCase()) !== -1;
            });
          }
          else {
            $scope.jobs = $scope.allJobs;
          }
        },
        function(error) {
          alertService("warning", "Unable to get jobs: ", error.data.message, "job-alert");
        });

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

        var user = dataTransfer.getUser();
        if (user && user.jobsViewed.indexOf($scope.id) === -1) {
          user.jobsViewed.push($scope.id);
          userService.update({
            id: user._id
          }, user).$promise.then(function(user) {
            dataTransfer.updateUser(user);
          }).catch(function(error) {
            alertService('warning', 'Opps! ', 'Error adding: ' + $scope.title + " to jobs viewed", 'job-alert');
          });
        }
      };

      $scope.openJobModal = function(type) {
        var user = dataTransfer.getUser();
        $scope.hasApplied = user && $scope.candidates.indexOf(user._id) !== -1;
        jobModalService.open(type, $scope);
      };

      $scope.markJob = function(job) {
        var user = dataTransfer.getUser();
        if (user) {
          if (user.jobsMarked.indexOf(job._id) === -1) {
            user.jobsMarked.push(job._id);
            userService.update({
              id: user._id
            }, user).$promise.then(function(user) {
              dataTransfer.updateUser(user);
              alertService("success", "You succesfully bookmarked: ", job.title, "job-alert");
            }).catch(function(error) {
              alertService('warning', 'Opps! ', 'Error adding: ' + job.title + " to bookmarked", 'job-alert');
            });
          }
          else {
            alertService('warning', 'Opps! ', 'You already have bookmarked: ' + job.title, 'job-alert');
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
        $scope.jobs = $scope.allJobs;
      };

      $scope.searchJob = search;

      function search() {
        jobService.title.query({
          title: $scope.jobToSearch
        }).$promise.then(
          function(data) {
            $scope.jobs = data;
          },
          function(error) {
            alertService("warning", "Unable to get jobs: ", error.data.message, "job-alert");
          });
      }
    }
  ]);
}());
