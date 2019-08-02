const mongoose = require("mongoose");
const validator = require("validator");

// defining collections
const User = mongoose.model("User", {
    // configure field for the User document
    name: {
        type: String,
        // setting up validator for this field
        required: true,
        trim: true
    },
    age: {
        type: Number,
        default: 0,
        // setting a custom validator
        validate(v) {
            return v >= 0;
        }
    },
    email: {
        type: String,
        trim: true,
        unique: true,
        validate(v) {
            // use validator from validator library
            return validator.isEmail(v);
        }
    },
    password: {
        type: String,
        required: true,
        trime: true,
        minlength: 7,
        validate: {
            validator(v) {
                return ! /.*password.*/.test(v.toLowerCase());
            },
            message: "User password cannot contain \"password\""
        }
    }
});

module.exports = User;