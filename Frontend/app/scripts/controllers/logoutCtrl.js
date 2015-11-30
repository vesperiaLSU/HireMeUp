(function() {
  "use strict";

  angular.module("jobFinder.app").controller("LogoutCtrl", ["$auth", "$state", "userStorage",
    function($auth, $state, userStorage) {
      $auth.logout();
      userStorage.removeUser();
      $state.go("main");
    }
  ]);
})();
