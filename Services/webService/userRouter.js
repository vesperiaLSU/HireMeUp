(function() {
    "use strict";
    var express = require("express");
    var loginHandler = require("../loginHandler.js");
    var registerHandler = require("../registerHandler.js");
    var facebookAuthHandler = require("../facebookAuthHandler.js");
    var googleAuthHandler = require("../googleAuthHandler.js");
    var emailVerification = require("../emailVerification.js");

    var userRouter = express.Router();

    userRouter.route("/login").post(loginHandler);
    userRouter.route("/register").post(registerHandler);
    userRouter.route("/auth/facebook").post(facebookAuthHandler);
    userRouter.route("/auth/google").post(googleAuthHandler);
    userRouter.route("/auth/verifyEmail").get(emailVerification.handler);

    module.exports = userRouter;
}());