(function() {
    "use strict";

    angular.module("common.service").factory("userService", ["$resource",
        function($resource) {
            return $resource("/api/users/:id", null, {
                "update": {
                    method: "PUT"
                }
            });
        }
    ]);
})();