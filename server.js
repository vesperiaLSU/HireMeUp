var express = require("express");
var mongoose = require("mongoose");
var jobModel = require("./models/Job.js");
var app = express();

app.set("view engine", "jade");
app.set("views", __dirname);

app.use(express.static(__dirname + "/public"));

app.get("/api/jobs", function(req, res){
    mongoose.model("Job").find({}).exec(function(err, collection){
      res.send(collection);  
    })
})

app.get("*", function(req, res){
   res.render("index"); 
});

//mongoose.connect("mongodb://localhost/jobfinder");
mongoose.connect("mongodb://chen:123@ds039484.mongolab.com:39484/jobfinder");

var con = mongoose.connection;
con.once("open", function(){
   console.log("connected to mongodb successfully"); 
   jobModel.seedJobs();
});

app.listen(process.env.PORT, process.env.IP);