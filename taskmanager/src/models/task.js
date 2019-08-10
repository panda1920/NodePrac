const mongoose = require("mongoose");
const validator = require("validator");

const schema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    }
});

const Task = mongoose.model("Task", schema);

module.exports = Task;