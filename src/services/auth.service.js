const userModel = require("../models/user.model");
const { genrateToken } = require("../utilities/jwt.utils");
const { errorGen } = require("../utilities/common.utils");
const requestModel = require("../models/request.model");

/**
 * this is a temporary authentication implementation.
 * TODO implement this auth using aws cognito
 * with email verification and then craete user account
 */
const authService = {};

authService.signin = async (email, password) => {
    const existingUser = await userModel.findOne({ email: email })
        .lean().exec();

    if (!existingUser) errorGen("client with email is not found", 404);

    if (existingUser.password === password) {
        const requests = await requestModel.find({ "$or": [{ to: existingUser._id }, { from: existingUser._id }] })
            .populate("to", "name username profilePic").populate("from", "name username profilePic").lean().exec()
        return { token: genrateToken(existingUser._id), user: { ...existingUser, password: '', requests } }
    } else errorGen("wrong password", 404);
}


module.exports = authService;