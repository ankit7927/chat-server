const mongoose = require("mongoose");
const messageSchema = require("./message.model");

const chatSchema = new mongoose.Schema({
    name: String,
    chatType: {
        type: String,
        enum: ["chat", "group"]
    },
    members: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
    messages: [messageSchema]
});

module.exports = mongoose.model("Chat", chatSchema);