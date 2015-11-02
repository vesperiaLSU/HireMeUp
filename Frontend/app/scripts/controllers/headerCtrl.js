(function () {
  "use strict";

  angular.module("psJwtApp").controller("HeaderCtrl", ["$scope", "$auth", function ($scope, $auth) {
    $scope.isAuthenticated = $auth.isAuthenticated;
  }]);
}());
