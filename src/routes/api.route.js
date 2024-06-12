const express = require("express");
const authController = require("../controllers/auth.controller");
const userController = require("../controllers/user.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const update = express.Router()
update.route("/profile").put(userController.updateProfile);

const user = express.Router()
user.use("/update", authMiddleware, update);
user.route("/get").get(authMiddleware, userController.getProfile);
user.route("/check-username").post(userController.isUsernameAvailable)
user.route("/new", userController.newUser)

const auth = express.Router()
auth.route("/signin").post(authController.signin);

const root = express.Router()
root.use("/auth", auth);
root.use("/user", user);

module.exports = root;