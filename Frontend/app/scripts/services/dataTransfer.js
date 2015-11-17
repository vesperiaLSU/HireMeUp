(function() {
    "use strict";
    angular.module("common.service").factory("dataTransfer", function($resource) {
        var jobTitle, currentUser;
        var addJob = function(title){
            jobTitle = title;
        }
        var getJob = function(){
            return jobTitle;
        }
        var clearJob = function(){
            jobTitle = "";
        }
        
        var updateUser = function(user){
            currentUser = user;
        }
        
        var getUser = function(){
            return currentUser;
        }
        
        var clearUser = function(){
            currentUser = null;
        }
        
        return {
            addJob: addJob,
            getJob: getJob,
            clearJob: clearJob,
            updateUser: updateUser,
            getUser: getUser,
            clearUser: clearUser
        };
    });
}());
