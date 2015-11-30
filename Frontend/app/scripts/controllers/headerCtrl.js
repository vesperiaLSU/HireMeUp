(function() {
  "use strict";

  angular.module("jobFinder.app").controller("HeaderCtrl", ["$scope", "$auth",
    function($scope, $auth) {
      $scope.isAuthenticated = $auth.isAuthenticated;
    }
  ]);
})();
