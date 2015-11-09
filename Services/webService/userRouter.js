var express = require("express");
var loginHandler = require("../loginHandler.js");
var registerHandler = require("../registerHandler.js");

var userRouter = express.Router();

userRouter.route("/login").post(loginHandler);

userRouter.route("/register").post(registerHandler);

module.exports = userRouter;