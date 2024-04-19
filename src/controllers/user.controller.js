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

userController.updateName = async (req, res, next) => {
    const userId = req.user._id;
    const newName = req.body.name;

    if (!userId || !isValidObjectId(userId) || !newName)
        return res.status(404).json({ message: "all fields are required" });

    try {
        res.json(await userService.updateName(userId, newName));
    } catch (error) {
        next(error);
    }
}

userController.updateUsername = async (req, res, next) => {
    const userId = req.user._id;
    const newUsername = req.body.username;

    if (!userId || !isValidObjectId(userId) || !newUsername)
        return res.status(404).json({ message: "all fields are required" });

    try {
        res.json(await userService.updateUsername(userId, newUsername));
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
module.exports = userController;