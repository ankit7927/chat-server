const fs = require("fs");
const { uniqueNamesGenerator, names, colors } = require('unique-names-generator');

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
    if (!fs.existsSync("assets/profils")) fs.mkdirSync("assets/profils")
}

const errorGen = (message, status)=>{
    const error = new Error(message);
    error.status = status;
    throw error
}

const getDefaultProfilePic = () =>{
    if (process.env.NODE_ENV==="dev") return "http://localhost:5000/public/defaults/profile.png"

}

const generateChatNames = () => {
    return uniqueNamesGenerator({
        dictionaries: [names, colors],
        separator: "-",
        length: 2,
        style: "lowerCase"
    });
};

module.exports = { assetsDirCheck, errorGen, roles, chatType, getDefaultProfilePic, generateChatNames }