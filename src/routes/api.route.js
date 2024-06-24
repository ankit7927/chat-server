const express = require("express");
const authController = require("../controllers/auth.controller");
const userController = require("../controllers/user.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const mediaMiddleware = require("../middlewares/media.middleware");

const update = express.Router()
update.route("/profile").put(mediaMiddleware.single("profilePic"), userController.updateProfile);


const user = express.Router()
user.use("/update", authMiddleware, update);

user.route("/get-profile").get(authMiddleware, userController.getProfile);
user.route("/get-requests").get(authMiddleware, userController.getRequests);
user.route("/get-chats").get(authMiddleware, userController.getChats);
user.route("/get-chat/:chatId").get(authMiddleware, userController.getChat);

user.route("/check-username").post(userController.isUsernameAvailable)
user.route("/new").post(userController.newUser)


const auth = express.Router()
auth.route("/signin").post(authController.signin);


const root = express.Router()
root.use("/auth", auth);
root.use("/user", user);

module.exports = root;