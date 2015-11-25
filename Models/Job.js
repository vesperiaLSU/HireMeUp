(function() {
    var Promise = require("bluebird");
    var mongoose = Promise.promisifyAll(require("mongoose"));

    var JobSchema = new mongoose.Schema({
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
        },
        candidates: [String],
        marked : {
            type: Boolean,
            required: true,
            default: false
        },
        applied : {
            type: Boolean,
            required: true,
            default: false
        }
    });

    module.exports = mongoose.model("Job", JobSchema);
}());