(function() {
  "use strict";

  angular.module("jobFinder.app").controller("LogoutCtrl", ["$auth", "$state", "dataTransfer",
    function($auth, $state, dataTransfer) {
      $auth.logout();
      dataTransfer.clearUser();
      $state.go("main");
    }
  ]);
}());
