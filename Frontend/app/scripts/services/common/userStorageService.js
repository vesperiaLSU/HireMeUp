(function() {
    'use strict';

    angular.module('common.service').factory('userStorage', ["$window",
        function($window) {
            var storage = $window.localStorage;
            var cachedUser;
            var userToken = "currentUser";
            var userStorage = {
                setUser: function(user) {
                    cachedUser = user;
                    storage.setItem(userToken, JSON.stringify(user));
                },
                getUser: function() {
                    if (!cachedUser) {
                        cachedUser = JSON.parse(storage.getItem(userToken));
                    }

                    return cachedUser;
                },
                removeUser: function() {
                    cachedUser = null;
                    storage.removeItem(userToken);
                }
            };
            return userStorage;
        }
    ]);
}());
