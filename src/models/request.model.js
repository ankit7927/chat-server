const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
    to:{ type: mongoose.Schema.ObjectId, ref: "User" },
    from:{ type: mongoose.Schema.ObjectId, ref: "User" },
});

module.exports = mongoose.model("Request", requestSchema);