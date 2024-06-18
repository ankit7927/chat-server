const { Server } = require("socket.io");
const { verifyToken } = require("../utilities/jwt.utils");
const userModel = require("../models/user.model");
const chatModel = require("../models/chat.model");
const requestModel = require("../models/request.model");

const socketService = (httpSrver) => {
    const io = new Server(httpSrver, { cors: "*" })

    io.use(async (socket, next) => {
        const token = socket.handshake.auth.token;

        if (token) {
            const payload = verifyToken(token);
            await userModel.findByIdAndUpdate({ _id: payload._id }, { $set: { active: true, socketId: socket.id } })
            next();
        } else {
            next(new Error("auth failed"));
        }
    })

    io.on("connection", async (socket) => {
        console.log(`joined ${socket.id}`);

        socket.on("send-request", async (data, callback) => {
            try {
                const toUser = await userModel.findOne({ username: data.to }).select("socketId").lean().exec()

                if (!toUser) return socket.to(socket.id).emit("outgoing-request-fail", { "error": "user not found" })

                const newRequest = await requestModel.create({ to: toUser._id, from: data.from });

                const requestData = await (await newRequest.populate("to", "name username")).populate("from", "name username");

                socket.to(toUser.socketId).emit("incoming-request", requestData);
                callback(requestData);
            } catch (err) {
                console.log(err);
                socket.to(socket.id).emit("outgoing-request-fail", err)
            }
        });

        socket.on("cancel-request", async (data, callback) => {
            try {
                const request = await requestModel.findByIdAndDelete({ _id: data.requestId })

                if (!request) return socket.to(socket.id).emit("request-canceling-failed", { "error": "request not found" })

                const user = await userModel.findById({ _id: data.toUser }).select("socketId").lean().exec()

                socket.to(user.socketId).emit("canceled-incoming-request", { requestId: data.requestId });

                callback({ requestId: data.requestId })
            } catch (err) {
                console.log(err);
                socket.to(socket.id).emit("outgoing-request-fail", err)
            }
        })

        socket.on("reject-request", async (data, callback) => {
            try {
                const request = await requestModel.findByIdAndDelete({ _id: data.requestId })

                if (!request) return socket.to(socket.id).emit("request-canceling-failed", { "error": "request not found" })

                const user = await userModel.findById({ _id: data.fromUser }).select("socketId").lean().exec()

                socket.to(user.socketId).emit("request-rejected", { requestId: data.requestId });

                callback({ requestId: data.requestId })
            } catch (err) {
                console.log(err);
                socket.to(socket.id).emit("reject-request-fail", err)
            }
        })

        socket.on("accept-request", async (data, callback) => {
            try {
                const fromUser = await userModel.findById({ _id: data.from._id }).lean();

                const newChat = await chatModel.create({ name: fromUser.name, members: [data.to, data.from] })

                await requestModel.findByIdAndDelete({ _id: data._id })

                socket.to(fromUser.socketId).emit("request-accepted", { newChat, requestId: data._id });

                callback({ newChat, requestId: data._id })
            } catch (err) {
                console.log(err);
                socket.to(socket.id).emit("reject-accept-fail", err)
            }
        })


        socket.on("disconnect", async (data) => {
            await userModel.findOneAndUpdate({ socketId: socket.id }, { "$set": { active: false, socketId: "" } })
        })
    })
}


module.exports = socketService;