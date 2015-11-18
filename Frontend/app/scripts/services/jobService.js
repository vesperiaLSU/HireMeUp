(function() {
    "use strict";

    var service = angular.module("common.service");

    service.factory("jobTitleService", ["$resource", function($resource) {
        return $resource("/api/jobs/:title", {title: "@title"}, null);
    }]);

    service.factory("jobIdService", ["$resource", function($resource) {
        return $resource("/api/jobs/:id", {id: "@id"}, {
            "update": {
                method: "PUT"
            }
        });
    }]);
}());
