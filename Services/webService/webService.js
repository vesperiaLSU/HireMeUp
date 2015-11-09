var bodyParser = require("body-parser");
/**custom services**/
var facebookAuthHandler = require("../facebookAuthHandler.js");
var googleAuthHandler = require("../googleAuthHandler.js");
var emailVerification = require("../emailVerification.js");

module.exports = function(app) {
    app.use(bodyParser.json());
    // app.post("/api/register", registerHandler);
    // app.post("/api/login", loginHandler);
    app.post("/api/auth/facebook", facebookAuthHandler);
    app.post("/api/auth/google", googleAuthHandler);
    //app.get("/api/jobs", jobHandler);
    app.get("/auth/verifyEmail", emailVerification.handler);
}