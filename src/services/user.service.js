const userModel = require("../models/user.model");
const { errorGen } = require("../utilities/common.utils");

const userService = {};

userService.getProfile = async (userId) => {
    const data = await userModel.findOne({ _id: userId })
        .select("name username").select("-password").lean();
    return data;
}

userService.updateName = async (userId, newName) => {
    const update = await userModel.findOneAndUpdate({ _id: userId },
        { "$set": { name: newName } }, { new: true })
        .select("name").lean().exec()

    if (update) return update;
    else errorGen("wrong data provided", 500);
}

userService.updateUsername = async (userId, newUsername) => {
    const update = await userModel.findOneAndUpdate({ _id: userId },
        { "$set": { username: newUsername } }, { new: true })
        .select("username").lean().exec()

    if (update) return update;
    else errorGen("wrong data provided", 500);
}

// TODO impl. update user profile image, email and password

module.exports = userService;