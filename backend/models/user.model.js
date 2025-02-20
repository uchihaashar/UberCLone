const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    fullname: {
        firstname: {
            type: String,
            required: true,
            minLength: [3, "First name must be at least 3 characters long"],
        },
        lastname: {
            type: String,
            minLength: [3, "Last name must be at least 3 characters long"],
        }
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,    
        required: true,
        select: false,  // ✅ Correct lowercase
    },
    socketId: {
        type: String,
    }
});

// 🔥 Fix: Static function for password hashing
userSchema.statics.hashPassword = async function(password) {
    return await bcrypt.hash(password, 10);
};

// 🔥 Generate Auth Token
userSchema.methods.generateAuthToken = function() {
    return jwt.sign({ _id: this._id }, process.env.JWT_SECRET ,{expiresIn: '24h'});
};

// 🔥 Compare Password Function
userSchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
};

const userModel = mongoose.model("user", userSchema);
module.exports = userModel;
 