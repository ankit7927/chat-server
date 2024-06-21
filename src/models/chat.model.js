const mongoose = require("mongoose");

// feature - TODO add private chat feature.
const chatSchema = new mongoose.Schema({
    name: String,
    image: String,
    members: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
    messages: []
});

module.exports = mongoose.model("Chat", chatSchema);