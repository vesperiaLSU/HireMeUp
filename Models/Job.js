(function() {
    var mongoose = require("mongoose");

    var JobSchema = new mongoose.Schema({
        _id: {
            type: Number
        },
        datePosted: {
            type: Date,
            default: Date.now
        },
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        views: {
            type: Number,
            default: 0
        },
        applicants: {
            type: Number,
            default: 0
        },
        company: {
            type: String,
            required: true,
            default: "new company"
        },
        active: {
            type: Boolean,
            required: true,
            default: true
        }
    });

    module.exports = mongoose.model("Job", JobSchema);
}());