(function() {
  'use strict';

  var app = angular.module('jobFinder.app', ["ui.router",
    "ngAnimate",
    "satellizer",
    "common.service"
  ]);

  app.config(["$urlRouterProvider", "$stateProvider", "$authProvider",
    function($urlRouterProvider, $stateProvider, $authProvider) {

      $urlRouterProvider.otherwise("/");

      $stateProvider
        .state("register", {
          url: "/register",
          templateUrl: "app/views/register.html",
          controller: "RegisterCtrl"
        })
        .state("main", {
          url: "/",
          templateUrl: "app/views/main.html"
        })
        .state("logout", {
          url: "/logout",
          controller: "LogoutCtrl"
        })
        .state("jobs", {
          url: "/jobs",
          templateUrl: "app/views/jobs.html",
          controller: "JobsCtrl"
        })
        .state("login", {
          url: "/login",
          templateUrl: "app/views/login.html",
          controller: "LoginCtrl"
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
  ]).run(function($window) {
    var params = $window.location.search.substring(1);
    if (params && $window.opener && $window.opener.location.origin === $window.location.origin) {
      var pair = params.split("=");
      var code = decodeURIComponent(pair[1]);

      $window.opener.postMessage(code, $window.location.origin);
    }
  });
}());
