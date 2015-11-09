var express = require("express");
var loginHandler = require("../loginHandler.js");
var registerHandler = require("../registerHandler.js");
var facebookAuthHandler = require("../facebookAuthHandler.js");
var googleAuthHandler = require("../googleAuthHandler.js");
var emailVerification = require("../emailVerification.js");

var userRouter = express.Router();

userRouter.route("/login").post(loginHandler);

userRouter.route("/register").post(registerHandler);

userRouter.route("/auth/facebook", facebookAuthHandler);
userRouter.route("/auth/google", googleAuthHandler);
userRouter.route("/auth/verifyEmail", emailVerification.handler);

module.exports = userRouter;