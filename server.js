(function() {
    /**pre-defined libraries**/
    var express = require("express");
    var mongoose = require("mongoose");
    var bodyParser = require("body-parser");
    var Promise = require("bluebird");

    /**custom service**/
    var dataService = require("./Services/dataService/dataService.js");
    var webService = require("./Services/webService/webService.js");
    var webConfig = require("./Config/webConfig.js");
    var jobRouter = require("./Services/webService/jobRouter.js");

    var app = express();

    app.engine('.html', require('ejs').renderFile);
    app.use(express.static(__dirname + "/Frontend"));
    app.use(bodyParser.json());
    app.use("/api", jobRouter);

    //webService(app);

    /**APIs**/
    app.get("/", function(req, res) {
        res.render("index.html");
    });

    Promise.promisifyAll(mongoose);
    mongoose.connect(webConfig.MONGODB, function() {
        console.log("connected to mongodb successfully");
        dataService.seedJobs();
    });



    app.listen(process.env.PORT, process.env.IP);
}());