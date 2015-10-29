var express = require("express");
var mongoose = require("mongoose");
var jobsData = require("./jobs-data.js");
var Promise = require("bluebird");
var app = express();

app.set("view engine", "jade");
app.set("views", __dirname);

app.use(express.static(__dirname + "/public"));

app.get("/api/jobs", function(req, res) {
    jobsData.findJobs().then(function(collection) {
        res.send(collection);
    })
});
app.get("*", function(req, res) {
    res.render("index");
});

Promise.promisifyAll(mongoose);

// mongoose.connect("mongodb://localhost/jobfinder");
mongoose.connect("mongodb://chen:123@ds039484.mongolab.com:39484/jobfinder", function(){
    console.log("connected to mongodb successfully");
    jobsData.seedJobs();
});

app.listen(process.env.PORT, process.env.IP);