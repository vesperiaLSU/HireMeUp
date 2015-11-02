(function(){
  "use strict";

  angular.module("psJwtApp").controller("LogoutCtrl", ["$auth", "$state", function ($auth, $state) {
    $auth.logout();
    $state.go("main");
  }]);
}());
