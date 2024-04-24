const mongoose = require("mongoose");
const { contactStatus } = require("../utilities/common.utils");

const contactSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.ObjectId, ref: "User" },
    status:{
        type:String,
        enum:[contactStatus.INCOMING, contactStatus.OUTGOING, contactStatus.CONNECTED]
    },

});

module.exports = contactSchema