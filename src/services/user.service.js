const chatModel = require("../models/chat.model");
const requestModel = require("../models/request.model");
const userModel = require("../models/user.model");
const { errorGen } = require("../utilities/common.utils");

const userService = {};

userService.newUser = async (data) => {
    const newUser = await userModel.create(data);
    if (newUser) {
        return { message: "created" };
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

userService.getChats = async (userId) => {
    return await userModel.findById({ _id: userId })
        .select("chats")
        .populate("chats")
        .populate({
            path: "chats",
            populate: {
                path: "members",
                select: "name username"
            }})
        .lean().exec()
}


userService.getChat = async (chatId) => {
    return await chatModel.findById({ _id: chatId })
        .select("-messages")
        .populate("members", "name username")
        .lean().exec()
}

userService.getRequests = async (userId) => {
    return await requestModel.find({ "$or": { to: userId, from: userId } }).lean().exec()
}


module.exports = userService;