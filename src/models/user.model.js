const mongoose = require("mongoose");

/**
 * in this user model 
 * the user account will be created with aws cognito and
 * then profile will be created in mongoose.
 * aws - email, password
 * mongo - name, username, etc
 */
const userSchema = new mongoose.Schema({
    name: String,
    username: {
        type: String,
        required: [true, "username required!"],
        unique: true,
    },

    // temp authenication field
    email: {
        type: String,
        required: [true, "email required!"],
        unique: true,
    },
    password: String,

    contact: {
        sent: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
        received: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
        contact: [{ type: mongoose.Schema.ObjectId, ref: "User" }]
    },
    chats: [{ type: mongoose.Schema.ObjectId, ref: "Chat" }]
});

module.exports = mongoose.model("User", userSchema);