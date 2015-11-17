(function() {
    "use strict";
    var User = require("../../Models/User.js");

    exports.updateUser = function(id, update) {
        var options = {
            new: true
        };
        return User.findByIdAndUpdateAsync(id, update, options);
    };
}());