app.factory("Jobs", ["$resource", function($resource){
    return $resource("/api/jobs");
}])