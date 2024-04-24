const express = require("express");
const userController = require("../controllers/user.controller");
const authMiddleware = require("../middlewares/auth.middleware");


const root = express.Router();
root.route("/add").post(authMiddleware, userController.addContactReq);
root.route("/get").get(authMiddleware, userController.getContacts);


module.exports = root;