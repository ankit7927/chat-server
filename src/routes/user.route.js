const express = require("express");
const userController = require("../controllers/user.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const updateRouter = express.Router();
updateRouter.route("/name").put(userController.updateName)
updateRouter.route("/username").put(userController.updateUsername)


const root = express.Router();
root.route("/get").get(authMiddleware, userController.getProfile)
root.use("/update", authMiddleware, updateRouter)


module.exports = root;