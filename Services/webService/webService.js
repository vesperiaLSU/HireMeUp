var bodyParser = require("body-parser");
/**custom services**/
var facebookAuthHandler = require("../facebookAuthHandler.js");
var jobHandler = require("../jobHandler.js");
var googleAuthHandler = require("../googleAuthHandler.js");
var loginHandler = require("../loginHandler.js");
var registerHandler = require("../registerHandler.js");
var emailVerification = require("../emailVerification.js");

module.exports = function(app) {
    app.use(bodyParser.json());
    app.post("/api/register", registerHandler);
    app.post("/api/login", loginHandler);
    app.post("/api/auth/facebook", facebookAuthHandler);
    app.post("/api/auth/google", googleAuthHandler);
    app.get("/api/jobs", jobHandler);
    app.get("/api/auth/verifyEmail", emailVerification.handler);
}