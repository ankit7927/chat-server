const { isValidObjectId } = require("mongoose");
const userService = require("../services/user.service");
const { getDefaultProfilePic } = require("../utilities/common.utils");

const userController = {};

userController.newUser = async (req, res, next) => {
    const data = req.body;

    if (!data.name || !data.email || !data.username || !data.password) 
        return res.status(404).json({ message: "all fileds are required" });

    data.profilePic = getDefaultProfilePic()
    
    try {
        res.json(await userService.newUser(data))
    } catch (error) {
        next(error)
    }
}

userController.getProfile = async (req, res, next) => {
    const userId = req.user._id;
    
    if (!userId || !isValidObjectId(userId))
        return res.status(404).json({ message: "userId is not a mongoid" });

    try {
        res.json(await userService.getProfile(userId));
    } catch (error) {
        next(error);
    }
}

userController.updateProfile = async (req, res, next) => {
    const userId = req.user._id;
    const newName = req.body.name;
    const newUsername = req.body.username;
    const profilePic = `${req.protocol}://${req.headers.host}/${req.file.path}`;

    if (!userId || !isValidObjectId(userId) || !newName, !newUsername)
        return res.status(404).json({ message: "all fields are required" });

    try {
        res.json(await userService.updateProfile(userId, newName, newUsername, profilePic));
    } catch (error) {
        next(error);
    }
}

userController.isUsernameAvailable = async (req, res, next) => {
    const username = req.body.username;

    if (!username)
        return res.status(404).json({ message: "all fields are required" });

    try {
        res.json(await userService.isUsernameAvailable(username));
    } catch (error) {
        next(error);
    }
}

userController.getChats = async (req, res, next) => {
    const userId = req.user._id;

    if (!userId || !isValidObjectId(userId))
        return res.status(404).json({ message: "userId is not a mongoid" });

    try {
        res.json(await userService.getChats(userId));
    } catch (error) {
        console.log(error);
        next(error);
    }
}

userController.getChat = async (req, res, next) => {
    const chatId = req.params.chatId

    if (!chatId || !isValidObjectId(chatId))
        return res.status(404).json({ message: "chatId is not a mongoid" });

    try {
        res.json(await userService.getChat(chatId));
    } catch (error) {
        next(error);
    }
}

userController.getRequests = async (req, res, next) => {
    const userId = req.user._id;

    if (!userId || !isValidObjectId(userId))
        return res.status(404).json({ message: "userId is not a mongoid" });

    try {
        res.json(await userService.getRequests(userId));
    } catch (error) {
        next(error);
    }
}

userController.getSystemInfo = async (req, res, next) => {
    return res.json(await userService.getSystemInfo());
}

module.exports = userController;

