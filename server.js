(function() {
    "use strict";
    /**pre-defined libraries**/
    var express = require("express");
    var mongoose = require("mongoose");
    var bodyParser = require("body-parser");
    var Promise = require("bluebird");

    /**custom service**/
    var webConfig = require("./Config/webConfig.js");
    var jobRouter = require("./Services/webService/jobRouter.js");
    var jobByIdRouter = require("./Services/webService/jobByIdRouter.js");
    var userRouter = require("./Services/webService/userRouter.js");

    var app = express();

    app.engine('.html', require('ejs').renderFile);
    app.use(express.static(__dirname + "/Frontend"));
    app.use(bodyParser.json());
    app.use("/api", jobRouter);
    app.use("/api", userRouter);
    app.use("/api", jobByIdRouter);

    /**APIs**/
    app.get("/", function(req, res) {
        res.render("index.html");
    });

    Promise.promisifyAll(mongoose);
    mongoose.connect(webConfig.MONGODB, function(err) {
        if (err) {
            console.log(err);
        }
        else {
            console.log("connected to mongodb successfully");
        }
    });

    app.listen(process.env.PORT, process.env.IP);
}());