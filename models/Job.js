var mongoose = require("mongoose");

var jobSchema = new mongoose.Schema({
    title: "String",
    description: "String"
});

module.exports = mongoose.model("Job", jobSchema);
