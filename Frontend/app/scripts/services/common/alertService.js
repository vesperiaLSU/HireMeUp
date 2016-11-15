(function() {
  "use strict";

  angular.module("common.service")
    .service("alertService", ["$rootScope", "$timeout",
      function alert($rootScope, $timeout) {
        var alertTimeout;
        return function(type, title, message, style, timeout) {
          $rootScope.alert = {
            hasBeenShown: true,
            show: true,
            type: type,
            style: style,
            message: message,
            title: title
          };
          $timeout.cancel(alertTimeout);
          alertTimeout = $timeout(function() {
            $rootScope.alert.show = false;
          }, timeout || 4000);
        };
      }
    ]);
}());
