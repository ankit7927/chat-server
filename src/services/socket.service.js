const { Server } = require("socket.io");
const { verifyToken } = require("../utilities/jwt.utils");
const userModel = require("../models/user.model");
const chatModel = require("../models/chat.model");
const requestModel = require("../models/request.model");
const { generateChatNames } = require("../utilities/common.utils");

const activeUsers = {};

const socketService = (httpSrver) => {
    const io = new Server(httpSrver, { cors: "*" });

    io.use(async (socket, next) => {
        const token = socket.handshake.auth.token;

        if (token) {
            const payload = verifyToken(token);
            activeUsers[payload._id] = socket.id;
            socket.userId = payload._id;
            next();
        } else {
            next(new Error("auth failed"));
        }
    });

    io.on("connection", async (socket) => {
        console.log(`joined ${socket.id}`);

        socket.on("send-request", async (data, callback) => {
            try {
                const toUser = await userModel
                    .findOne({ username: data.to })
                    .select("name")
                    .lean()
                    .exec();

                if (!toUser)
                    return socket.to(socket.id).emit("outgoing-request-fail", {
                        error: "user not found",
                    });

                const newRequest = await requestModel.create({
                    to: toUser._id,
                    from: data.from,
                });

                const requestData = await (
                    await newRequest.populate("to", "name username profilePic")
                ).populate("from", "name username profilePic");

                socket
                    .to(activeUsers[toUser._id])
                    .emit("incoming-request", requestData);
                callback(requestData);
            } catch (err) {
                console.log(err);
                socket.to(socket.id).emit("outgoing-request-fail", err);
            }
        });

        socket.on("cancel-request", async (data, callback) => {
            try {
                const request = await requestModel.findByIdAndDelete({
                    _id: data.requestId,
                });

                if (!request)
                    return socket
                        .to(socket.id)
                        .emit("request-canceling-failed", {
                            error: "request not found",
                        });

                const user = await userModel
                    .findById({ _id: data.toUser })
                    .select("socketId")
                    .lean()
                    .exec();

                socket
                    .to(activeUsers[request.to._id])
                    .emit("canceled-incoming-request", {
                        requestId: data.requestId,
                    });

                callback({ requestId: data.requestId });
            } catch (err) {
                console.log(err);
                socket.to(socket.id).emit("outgoing-request-fail", err);
            }
        });

        socket.on("reject-request", async (data, callback) => {
            try {
                const request = await requestModel.findByIdAndDelete({
                    _id: data.requestId,
                });

                if (!request)
                    return socket
                        .to(socket.id)
                        .emit("request-canceling-failed", {
                            error: "request not found",
                        });

                const user = await userModel
                    .findById({ _id: data.fromUser })
                    .select("name")
                    .lean()
                    .exec();

                socket
                    .to(activeUsers[data.fromUser])
                    .emit("request-rejected", { requestId: data.requestId });

                callback({ requestId: data.requestId });
            } catch (err) {
                console.log(err);
                socket.to(socket.id).emit("reject-request-fail", err);
            }
        });

        socket.on("accept-request", async (data, callback) => {
            try {
                const newChat = await chatModel.create({
                    name: generateChatNames(),
                    members: [data.to, data.from],
                });

                const fromUser = await userModel
                    .findByIdAndUpdate(
                        { _id: data.from._id },
                        { $push: { chats: newChat._id } }
                    )
                    .lean();
                await userModel
                    .findByIdAndUpdate(
                        { _id: data.to._id },
                        { $push: { chats: newChat._id } }
                    )
                    .lean();

                await requestModel.findByIdAndDelete({ _id: data._id });

                socket
                    .to(activeUsers[fromUser._id])
                    .emit("request-accepted", { newChat, requestId: data._id });

                callback({ newChat, requestId: data._id });
            } catch (err) {
                console.log(err);
                socket.to(socket.id).emit("reject-accept-fail", err);
            }
        });

        socket.on("send-message", async (data, callback) => {
            try {
                const newMessage = {
                    creator: data.creator,
                    content: data.content,
                    timeStamp: new Date(),
                };

                await chatModel.findByIdAndUpdate(
                    { _id: data.chatId },
                    { $push: { messages: newMessage } }
                );
                
                socket.to(activeUsers[data.receiver]).emit("incoming-message", {
                    chatId: data.chatId,
                    message: newMessage,
                });
                callback(newMessage);
            } catch (err) {
                console.log(err);
                socket.to(socket.id).emit("sending-message-fail", err);
            }
        });

        socket.on("disconnect", async () => {
            delete activeUsers[socket.userId];
        });
    });
};

module.exports = socketService;
