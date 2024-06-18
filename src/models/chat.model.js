const mongoose = require("mongoose");
const messageSchema = require("./message.schema");

// feature - TODO add private chat feature.
const chatSchema = new mongoose.Schema({
    name: String,
    image: String,
    admins: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
    members: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
    messages: [messageSchema]
});

module.exports = mongoose.model("Chat", chatSchema);