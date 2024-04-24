const contactSchema = require("../models/contact.schema");
const userModel = require("../models/user.model");
const { errorGen, contactStatus } = require("../utilities/common.utils");

const userService = {};

userService.getProfile = async (userId) => {
    const data = await userModel.findOne({ _id: userId })
        .select("name username").select("-password").lean();
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
    return await userModel.find({ username }).countDocuments().lean()
}

userService.getContacts = async (userId) => {
    const contact = await userModel.findOne({ _id: userId })
        .select("contact")
        .populate({
            path: "contact",
            populate: {
                path: 'user',
                select: 'name username',
            }
        }).lean().exec();

    return contact.contact;
}

userService.addContactReq = async (userId, toId) => {

    await userModel.findByIdAndUpdate({ _id: toId },
        { "$push": { contact: { user: userId, status: contactStatus.INCOMING } } });

    await userModel.findByIdAndUpdate({ _id: userId },
        { "$push": { contact: { user: toId, status: contactStatus.OUTGOING } } });

    return { message: "contact request sent" }
}

module.exports = userService;