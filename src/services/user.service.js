const userModel = require("../models/user.model");
const { errorGen } = require("../utilities/common.utils");
const { genrateToken } = require("../utilities/jwt.utils");

const userService = {};

userService.newUser = async (data) => {
    const newUser = await userModel.create(data);
    if (newUser) {
        return { token: genrateToken(newUser._id), _id: newUser._id };
    } else errorGen("something went wrong");
}

userService.getProfile = async (userId) => {
    const data = await userModel.findOne({ _id: userId })
        .select("name username email").lean();
    return data;
}

userService.updateProfile = async (userId, newName, newUsername) => {
    const update = await userModel.findOneAndUpdate({ _id: userId },
        { "$set": { name: newName, username: newUsername } }, { new: true })
        .select("name username").lean().exec()

    if (update) return update;
    else errorGen("wrong data provided", 500);
}

// TODO impl. update user profile image, email and password

userService.isUsernameAvailable = async (username) => {
    return await userModel.find({ username: { "$regex": username } }).select("name username").lean().exec()
}

userService.getFriends = async (userId) => {
    return await userModel.findById({ _id: userId })
        .select("friends")
        .populate("friends.friends", "name username")
        .populate("friends.incoming", "name username")
        .populate("friends.outgoing", "name username")
        .lean().exec()
}


module.exports = userService;