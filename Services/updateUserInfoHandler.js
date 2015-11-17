(function() {
    'use strict';
    var userService = require("./dataService/userService.js");

    module.exports = function(req, res, next) {
        var id = req.params.id;
        var update = req.body;
        userService.updateUser(id, update).then(function(updated) {
            res.send(updated);
        }).catch(function(err) {
            res.status(404).send({
                message: err
            });
        });
    }
}());