const { isValidObjectId } = require("mongoose");
const contactService = require("../services/contact.service");

const contactController = {};

contactController.getContacts = async (req, res, next) => {
    const userId = req.user._id;
    const type = req.params.type;

    if (!userId || !type || !isValidObjectId(userId))
        return res.status(404).json({ message: "all fields are required" });

    try {
        res.json(await contactService.getContacts(userId, type));
    } catch (error) {
        next(error);
    }
}

contactController.addContactReq = async (req, res, next) => {
    const userId = req.user._id;
    const toId = req.body.toId;

    if (!userId || !toId || !isValidObjectId(userId) || !isValidObjectId(toId))
        return res.status(404).json({ message: "all fields are required and must be object ids" });

    try {
        res.json(await contactService.addContactReq(userId, toId));
    } catch (error) {
        next(error);
    }
}

contactController.acceptRejectContactReq = async (req, res, next) => {
    const userId = req.user._id;
    const contactId = req.body.contactId;
    const action = req.body.action;

    if (!userId || !contactId || !action || !isValidObjectId(userId) || !isValidObjectId(contactId))
        return res.status(404).json({ message: "all fields are required and must be object ids" });

    if (!(["accept", "reject"].includes(action))) 
        return res.status(404).json({ message: "action is not supported" });

    try {
        res.json(await contactService.acceptRejectContactReq(userId, contactId, action==="accept"));
    } catch (error) {
        next(error);
    }
}

contactController.cancleContactReq = async (req, res, next) => {
    const userId = req.user._id;
    const contactId = req.body.contactId;

    if (!userId || !contactId || !isValidObjectId(userId) || !isValidObjectId(contactId))
        return res.status(404).json({ message: "all fields are required and must be object ids" });

    try {
        res.json(await contactService.cancleContactReq(userId, contactId));
    } catch (error) {
        next(error);
    }
}


module.exports = contactController;

