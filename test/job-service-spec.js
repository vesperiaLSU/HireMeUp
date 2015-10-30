var expect = require("chai").expect;
var request = require("supertest");
var express= require("express");
var Promise = require("bluebird");
var app = express();

var dataSavedJob;
var db = {
    saveJob: function(job){
        dataSavedJob = job;
    },
    findJobs: function(){
        return new Promise(function(resolve, reject){
            resolve(["hi"]);
        })
    }
};

var jobService = require("../jobs-service.js")(db, app);

describe("save jobs", function() {
    
    var newJob = {
        title: "Cook",
        description: "You will be making bagels"
    };

    it("should pass the job to the databse save", function(done) {
        request(app).post("/api/jobs").send(newJob).end(function(err, res){
            expect(dataSavedJob).to.deep.equal(newJob);
            done();
        })
        
    });
})

describe("get jobs", function(){
    it("should give me a jons list of jobs", function(done){
        request(app).get("/api/jobs")
        .expect("Content-Type", /json/)
        .end(function(err, res){
            expect(res.body).to.be.a("Array");
            done();
        })
    })
})