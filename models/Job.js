var mongoose = require("mongoose");

var jobSchema = mongoose.Schema({
   title: "String",
   description: "String"
});

var Job = mongoose.model("Job", jobSchema);

exports.seedJobs = function(){
    Job.find({}).exec(function(err, collection){
        if(collection.length === 0){
            Job.create({title: "Cook", description: "You will be making bagels"});
            Job.create({title: "Waiter", description: "You will be serving food"});
            Job.create({title: "Programmer", description: "You will be mindlessly typing code"});
            Job.create({title: "Axe Maker", description: "We need many axes made...so many..."});
        }
    })
};