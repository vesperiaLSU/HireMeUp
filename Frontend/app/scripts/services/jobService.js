(function() {
    angular.module("common.service").factory("jobService", ["$resource", function($resource) {
        return $resource("/api/jobs/:id", {id: "@_id"}, {
            update: {
                method: "PUT"
            }
        });
    }]);
}());
