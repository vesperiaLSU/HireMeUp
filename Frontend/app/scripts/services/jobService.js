(function() {
    "use strict";

    var service = angular.module("common.service");

    service.factory("titleSearch", ["$resource", function($resource) {
        return $resource("/api/jobs/:title", null, null);
    }]);

    service.factory("idSearch", ["$resource", function($resource) {
        return $resource("/api/jobs/:id", null, {
            "update": {
                method: "PUT"
            }
        });
    }]);
}());
