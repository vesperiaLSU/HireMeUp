(function() {
    "use strict";

    var service = angular.module("common.service");

    service.factory("jobTitleService", ["$resource", function($resource) {
        return $resource("/api/jobs/:title", null, null);
    }]);

    service.factory("jobIdService", ["$resource", function($resource) {
        return $resource("/api/jobs/:id", null, {
            "update": {
                method: "PUT"
            }
        });
    }]);
}());
