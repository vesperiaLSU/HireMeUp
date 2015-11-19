(function() {
  'use strict';

  var app = angular.module('jobFinder.app', [
    "ui.router",
    "ngAnimate",
    "satellizer",
    "common.service",
    "ui.bootstrap"
  ]);

  app.config(["$urlRouterProvider", "$stateProvider", "$authProvider",
    function($urlRouterProvider, $stateProvider, $authProvider) {

      $urlRouterProvider.otherwise("/");

      $stateProvider
        .state("register", {
          url: "/register",
          templateUrl: "/app/views/register.html",
          controller: "RegisterCtrl"
        })
        .state("main", {
          url: "/",
          templateUrl: "/app/views/main.html",
          controller: "MainCtrl"
        })
        .state("logout", {
          url: "/logout",
          controller: "LogoutCtrl"
        })
        .state("jobs", {
          url: "/jobs",
          templateUrl: "/app/views/jobs.html",
          controller: "JobsCtrl",
          resolve: {
            jobService: "jobService",
            jobs: function(jobService) {
              return jobService.title.query({}).$promise;
            }
          }
        })
        .state("login", {
          url: "/login",
          templateUrl: "/app/views/login.html",
          controller: "LoginCtrl"
        })
        .state("userProfile", {
          url: "/userProfile",
          templateUrl: "/app/views/userProfile.html",
          controller: "ProfileCtrl",
          controllerAs: "vm",
          resolve: {
            userStorage: "userStorage",
            jobService: "jobService",
            jobsViewed: function(userStorage, jobService) {
              var user = userStorage.getUser();
              return jobService.jobId.query({
                jobList: JSON.stringify(user.jobsViewed)
              }).$promise;
            },
            jobsMarked: function(userStorage, jobService) {
              var user = userStorage.getUser();
              return jobService.jobId.query({
                jobList: JSON.stringify(user.jobsMarked)
              }).$promise;
            },
            jobsApplied: function(userStorage, jobService) {
              var user = userStorage.getUser();
              return jobService.jobId.query({
                jobList: JSON.stringify(user.jobsApplied)
              }).$promise;
            },
            jobsPosted: function(userStorage, jobService) {
              var user = userStorage.getUser();
              return jobService.jobId.query({
                jobList: JSON.stringify(user.jobsPosted)
              }).$promise;
            }
          }
        })
        .state("userProfile.jobsViewed", {
          url: "/jobsViewed",
          templateUrl: "/app/views/userProfileJobsViewed.html"
        })
        .state("userProfile.jobsMarked", {
          url: "/jobsMarked",
          templateUrl: "/app/views/userProfileJobsMarked.html"
        })
        .state("userProfile.jobsApplied", {
          url: "/jobsApplied",
          templateUrl: "/app/views/userProfileJobsApplied.html"
        });

      $authProvider.google({
        clientId: "339049144467-oukcl6dsgubkqmb5toc2khe73h0r5vml.apps.googleusercontent.com",
        url: "api/auth/google"
      });

      $authProvider.facebook({
        clientId: "955330687857756",
        url: "api/auth/facebook"
      });

      $authProvider.loginUrl = "/api/login";
      $authProvider.signupUrl = "/api/register";

    }
  ]);
  // .run(function($window) {
  //   var params = $window.location.search.substring(1);
  //   if (params && $window.opener && $window.opener.location.origin === $window.location.origin) {
  //     var pair = params.split("=");
  //     var code = decodeURIComponent(pair[1]);

  //     $window.opener.postMessage(code, $window.location.origin);
  //   }
  // });
}());
