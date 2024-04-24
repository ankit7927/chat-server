const userModel = require("../models/user.model");
const { genrateToken } = require("../utilities/jwt.utils");
const { errorGen } = require("../utilities/common.utils");

/**
 * this is a temporary authentication implementation.
 * TODO implement this auth using aws cognito
 * with email verification and then craete user account
 */
const authService = {};

authService.signin = async (email, password) => {
    const existingUser = await userModel.findOne({ email: email })
        .select("password").lean().exec();

    if (!existingUser) errorGen("client with email is not found", 404);

    if (existingUser.password === password) {
        return { token: genrateToken(existingUser._id), _id: existingUser._id }
    } else errorGen("wrong password", 404);
}


authService.signup = async (data) => {
    const newUser = await userModel.create(data);
    if (newUser) {
        return { token: genrateToken(newUser._id), _id: newUser._id };
    } else errorGen("something went wrong");
}


module.exports = authService;