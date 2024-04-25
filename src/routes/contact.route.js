const express = require("express");
const contactController = require("../controllers/contact.controller");


const root = express.Router();
root.route("/add").post(contactController.addContactReq);
root.route("/get/:type").get(contactController.getContacts);
root.route("/acc-rej").post(contactController.acceptRejectContactReq);
root.route("/cancle").post(contactController.cancleContactReq);


module.exports = root;