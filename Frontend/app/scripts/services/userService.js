(function() {
    "use strict";

    var service = angular.module("common.service");

    service.factory("userIdService", ["$resource", function($resource) {
        return $resource("/api/users/:id", null, {
            "update": {
                method: "PUT"
            }
        });
    }]);
}());