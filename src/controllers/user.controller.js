const { isValidObjectId } = require("mongoose");
const userService = require("../services/user.service");

const userController = {};

userController.getProfile = async (req, res, next) => {
    const userId = req.user._id;
    console.log(userId);
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

    if (!userId || !isValidObjectId(userId) || !newName, !newUsername)
        return res.status(404).json({ message: "all fields are required" });

    try {
        res.json(await userService.updateProfile(userId, newName, newUsername));
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

userController.getContacts = async (req, res, next) => {
    const userId = req.user._id;

    if (!userId || !isValidObjectId(userId))
        return res.status(404).json({ message: "all fields are required" });

    try {
        res.json(await userService.getContacts(userId));
    } catch (error) {
        next(error);
    }
}

module.exports = userController;

