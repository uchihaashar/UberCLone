const mongoose = require("mongoose");

const blackListTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 86400 // Token will be removed after 24 hours (86400 seconds)
    }
});

module.exports = mongoose.model("BlackListToken", blackListTokenSchema);