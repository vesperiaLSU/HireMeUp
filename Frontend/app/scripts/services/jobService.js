(function() {
    angular.module("common.service").factory("jobService", ["$resource", function($resource) {
        return $resource("/api/jobs/:title", null, {
            "update": {
                method: "PUT"
            }
        });
    }]);
}());
