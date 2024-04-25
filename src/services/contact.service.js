const userModel = require("../models/user.model");
const { errorGen, contactStatus } = require("../utilities/common.utils");

const contactService = {};


contactService.getContacts = async (userId, type) => {
    let contact = {}
    if (type === contactStatus.CONNECTED.toLowerCase()) {
        contact = await userModel.findOne({ _id: userId })
            .select("contact")
            .populate("contact", "name username")
            .lean().exec();
        return contact.contact;
    } else {
        contact = await userModel.findOne({ _id: userId })
            .select("contactReq")
            .populate({
                path: "contactReq",
                populate: ({
                    path: "from to",
                    select: "name username"
                })
            })
            .lean().exec();

        return contact.contactReq;
    }
}

contactService.addContactReq = async (userId, toId) => {

    await userModel.findByIdAndUpdate({ _id: toId },
        { "$push": { contactReq: { from: userId, to: toId, status: contactStatus.INCOMING } } });

    await userModel.findByIdAndUpdate({ _id: userId },
        { "$push": { contactReq: { from: userId, to: toId, status: contactStatus.OUTGOING } } });

    return { message: "contact request sent" }
}

contactService.acceptRejectContactReq = async (userId, contactId, accept) => {

    const data = await userModel.findOne({ "contactReq._id": contactId })
        .select("contactReq").lean().exec();

    const contactReqData = data.contactReq[0];

    if (contactReqData.status === contactStatus.OUTGOING)
        errorGen("outgoing request cant be accepted or rejected by sender itself", 404);

    await userModel.findByIdAndUpdate({ _id: userId },
        accept ?
            {
                "$push": {
                    contact: contactReqData.from
                },
                "$pull": {
                    contactReq: {
                        _id: contactId
                    }
                }
            } : {
                "$pull": {
                    contactReq: {
                        _id: contactId
                    }
                }
            });

    await userModel.findByIdAndUpdate({ _id: contactReqData.from },
        accept ? {
            "$push": {
                contact: contactReqData.to
            },
            "$pull": {
                contactReq: {
                    to: contactReqData.to
                }
            }
        } : {
            "$pull": {
                contactReq: {
                    to: contactReqData.to
                }
            }
        });

    return accept ? { message: "request accepted" } : { message: "request rejected" };
}

contactService.cancleContactReq = async (userId, contactId) => {
    const data = await userModel.findOne({ "contactReq._id": contactId })
        .select("contactReq").lean().exec();

    const contactReqData = data.contactReq[0];

    if (contactReqData.status === contactStatus.INCOMING)
        errorGen("incoming request cant be cancled by receiver", 404);

    await userModel.findByIdAndUpdate({ _id: userId },
        {
            "$pull": {
                contactReq: {
                    _id: contactId
                }
            }
        });

    await userModel.findByIdAndUpdate({ _id: contactReqData.to },
        {
            "$pull": {
                contactReq: {
                    to: contactReqData.to
                }
            }
        });
    return { message: "request cancled" }
}

module.exports = contactService;