const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const contactController = require("../controllers/contact.controller");


const root = express.Router();
root.route("/add").post(authMiddleware, contactController.addContactReq);
root.route("/get/:type").get(authMiddleware, contactController.getContacts);
root.route("/accept").post(authMiddleware, contactController.acceptContactReq);


module.exports = root;