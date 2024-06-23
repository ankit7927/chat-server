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
    profilePic: String,

    // temp authenication field
    email: {
        type: String,
        required: [true, "email required!"],
        unique: true,
    },
    password: String,

    chats: [{ type: mongoose.Schema.ObjectId, ref: "Chat" }],
});

module.exports = mongoose.model("User", userSchema);
