const mongoose = require("mongoose");
const messageSchema = require("./message.schema");
const { chatType } = require("../utilities/common.utils");

// feature - TODO add private chat feature.
const chatSchema = new mongoose.Schema({
    name: String,
    type: {
        type: String,
        enum: [chatType.CHAT, chatType.GROUP, chatType.REQUEST]
    },
    members: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
    messages: [messageSchema]
});

module.exports = mongoose.model("Chat", chatSchema);