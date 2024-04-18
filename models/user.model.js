const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: String,
    email: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    contact: {
        sent: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
        received: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
        contact: [{ type: mongoose.Schema.ObjectId, ref: "User" }]
    },
    chats: [{ type: mongoose.Schema.ObjectId, ref: "Chat" }]
});

module.exports = mongoose.model("User", userSchema);