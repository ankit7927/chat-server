const express = require("express");
const userController = require("../controllers/user.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const updateRouter = express.Router();
updateRouter.route("/profile").put(userController.updateProfile);


const root = express.Router();
root.route("/get").get(authMiddleware, userController.getProfile);
root.route("/get-contact").get(authMiddleware, userController.getContacts);
root.use("/update", authMiddleware, updateRouter);
root.route("/check-username").get(userController.isUsernameAvailable)

module.exports = root;