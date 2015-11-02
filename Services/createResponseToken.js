(function() {
    var jwt = require("jwt-simple");
    var moment = require("moment");
    var webConfig = require("../Config/webConfig.js");

    module.exports = function(user, req, res) {
        var payload = {
            iss: req.hostname,
            email: user.email,
            ggId: user.googleId,
            fbId: user.facebookId,
            exp: moment().add(10, "days").unix()
        };

        var token = jwt.encode(payload, webConfig.LOGIN_SECRET);

        res.status(200).send({
            user: user.toJSON(),
            token: token
        });
    }
}());
