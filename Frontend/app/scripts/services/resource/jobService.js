(function() {
    "use strict";

    angular.module("common.service").factory("jobService", ["$resource",
        function($resource) {
            return {
                title: $resource("/api/jobs/:title", {}, {}),
                jobId: $resource("/api/jobById/:id", {}, {
                    update: {
                        method: "PUT"
                    }
                })
            };
        }
    ]);
}());
