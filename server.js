(function() {
    /**pre-defined libraries**/
    var express = require("express");
    var mongoose = require("mongoose");
    var bodyParser = require("body-parser");
    var Promise = require("bluebird");

    /**custom service**/
    var jobService = require("./Services/dataService/jobService.js");
    var webService = require("./Services/webService/webService.js");
    var webConfig = require("./Config/webConfig.js");
    var jobRouter = require("./Services/webService/jobRouter.js");
    var userRouter = require("./Services/webService/userRouter.js");

    var app = express();

    // app.use(function(req, res, next){
    //   res.header("Access-Control-Allow-Origin", "https://ide.c9.io");
    //   res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");
    //   res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

    //   next();
    // });

    app.engine('.html', require('ejs').renderFile);
    app.use(express.static(__dirname + "/Frontend"));
    app.use(bodyParser.json());
    app.use("/api", jobRouter);
    app.use("/api", userRouter);


    //webService(app);

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
            jobService.seedJobs();
        }
    });

    app.listen(process.env.PORT, process.env.IP);
}());