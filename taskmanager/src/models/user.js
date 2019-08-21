const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Task = require('../models/task');

const schema = new mongoose.Schema({
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
        unique: true,
        trim: true,
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
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
}, {timestamps: true});

// define virtual properties
schema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
});

// define hooks
schema.pre('save', async function(next) {
    const user = this;

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }

    next();
});
schema.pre('remove', async function(next) {
    const user = this;

    try {
        await Task.deleteMany({owner: user._id});
    } catch(e) {
        console.log('Error: Failed to delete tasks upon user deletion.');
    }

    next();
});

// define instance methods
schema.methods.createAuthToken = function() {
    let user = this;

    return jwt.sign({_id: user._id.toString()}, 'thisismycourse');
}
schema.methods.saveToken = async function(token) {
    let user = this;

    user.tokens = user.tokens.concat({token});
    await user.save();
}
schema.methods.toJSON = function() {
    let user = this;
    let publicProfile = user.toObject();

    delete publicProfile.password;
    delete publicProfile.tokens;

    return publicProfile;
}

// define static methods
schema.statics.findByCredentials = async function(email, password) {
    let user = await this.findOne({email});

    if (!user) {
        throw new Error(`User with email "${email}" was not found.`);
    }

    let passwordMatched = await bcrypt.compare(password, user.password);

    if (!passwordMatched) {
        throw new Error('User authentication failed');
    }

    return user;
}

const User = mongoose.model("User", schema);

module.exports = User;