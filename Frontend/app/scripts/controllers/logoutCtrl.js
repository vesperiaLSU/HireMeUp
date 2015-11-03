(function(){
  "use strict";

  angular.module("jobFinder.app").controller("LogoutCtrl", ["$auth", "$state", function ($auth, $state) {
    $auth.logout();
    $state.go("main");
  }]);
}());
