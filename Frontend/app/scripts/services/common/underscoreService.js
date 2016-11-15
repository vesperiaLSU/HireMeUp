(function() {
    'use strict';

    angular.module('common.service').factory('_', ['$window', function($window) {
        return $window._;
    }]);
}());
