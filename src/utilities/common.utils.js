const fs = require("fs");

const roles = {
    ADMIN: "ADMIN",
    CONTRIBUTOR: "CONTRIBUTOR",
    USER: "USER",
    STAFF: "STAFF"
}

const chatType = {
    CHAT:"CHAT",
    GROUP:"GROUP",
    REQUEST:"REQUEST"
}

const assetsDirCheck = () => {
    if (!fs.existsSync("assets")) fs.mkdirSync("assets")
    if (!fs.existsSync("assets/mediaMax")) fs.mkdirSync("assets/mediaMax")
    if (!fs.existsSync("assets/mediaMid")) fs.mkdirSync("assets/mediaMid")
    if (!fs.existsSync("assets/mediaLow")) fs.mkdirSync("assets/mediaLow")
}

const errorGen = (message, status)=>{
    const error = new Error(message);
    error.status = status;
    throw error
}

module.exports = { assetsDirCheck, errorGen, roles, chatType }