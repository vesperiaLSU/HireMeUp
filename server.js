(function() {
    /**pre-defined libraries**/
    var express = require("express");
    var mongoose = require("mongoose");
    var bodyParser = require("body-parser");
    var Promise = require("bluebird");
    var jobsData = require("./jobs-data.js");

    /**custom services**/
    var facebookAuth = require("./Services/facebookAuth.js");
    var jobs = require("./Services/jobs.js");
    var googleAuth = require("./Services/googleAuth.js");
    var login = require("./Services/login.js");
    var register = require("./Services/register.js");
    var webConfig = require("./Config/webConfig.js");
    var emailVerification = require("./Services/emailVerification.js");

    var app = express();

    require("./jobs-service.js")(jobsData, app);

    app.engine('.html', require('ejs').renderFile);

    app.use(express.static(__dirname + "/Frontend"));
    app.use(bodyParser.json());

    /**APIs**/
    app.get("/", function(req, res) {
        res.render("index.html");
    });
    app.post("/register", register);
    app.post("/login", login);
    app.post("/auth/facebook", facebookAuth);
    app.post("/auth/google", googleAuth);
    app.get("/jobs", jobs);
    app.get("/auth/verifyEmail", emailVerification.handler);

    Promise.promisifyAll(mongoose);

    // mongoose.connect("mongodb://localhost/jobfinder");
    mongoose.connect(webConfig.MONGODB, function() {
        console.log("connected to mongodb successfully");
        jobsData.seedJobs();
    });

    app.listen(process.env.PORT, process.env.IP);
}());