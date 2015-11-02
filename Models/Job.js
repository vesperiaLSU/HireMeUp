(function() {
    var mongoose = require("mongoose");

    var JobSchema = new mongoose.Schema({
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        }
    });

    module.exports = mongoose.model("Job", JobSchema);
}());