const { Server } = require("socket.io");
const { verifyToken } = require("../utilities/jwt.utils");
const userModel = require("../models/user.model");

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
                if (data.to && data.from) {
                    const user = await userModel.findOneAndUpdate({ username: data.to },
                        { "$push": { "friends.incoming": data.from } }).select("name username socketId").lean().exec()

                    const user1 = await userModel.findByIdAndUpdate({ _id: data.from },
                        { "$push": { "friends.outgoing": user._id } }).select("name username").lean().exec()

                    socket.to(user.socketId).emit("incoming-request", { name: user1.name, username: user1.username, _id: user1._id });
                    callback({ name: user.name, username: user.username, _id: user._id })
                } else {
                    console.log("to or from cant be empty");
                    socket.to(socket.id).emit("outgoing-request-fail", { "error": "to or from cant be empty" })
                }
            } catch (err) {
                console.log(err);
                socket.to(socket.id).emit("outgoing-request-fail", err)
            }
        },);

        socket.on("cancel-request", async (data, callback) => {
            try {
                if (data.to && data.from) {
                    const user = await userModel.findOneAndUpdate({ _id: data.to },
                        { "$pull": { "friends.incoming": data.from } }).select("name username socketId").lean().exec()

                    const user1 = await userModel.findByIdAndUpdate({ _id: data.from },
                        { "$pull": { "friends.outgoing": user._id } }).select("name username").lean().exec()

                    socket.to(user.socketId).emit("canceled-incoming-request", { name: user1.name, username: user1.username, _id: user1._id });
                    callback({ status: "success" })
                } else {
                    console.log("to or from cant be empty");
                    socket.to(socket.id).emit("outgoing-request-fail", { "error": "to or from cant be empty" })
                }
            } catch (err) {
                console.log(err);
                socket.to(socket.id).emit("outgoing-request-fail", err)
            }
        })


        socket.on("reject-request", async (data, callback) => {
            try {
                if (data.to && data.from) {
                    const user = await userModel.findOneAndUpdate({ _id: data.to },
                        { "$pull": { "friends.incoming": data.from } }).select("name username").lean().exec()

                    const user1 = await userModel.findByIdAndUpdate({ _id: data.from },
                        { "$pull": { "friends.outgoing": user._id } }).select("name username socketId").lean().exec()

                    socket.to(user1.socketId).emit("request-rejected", { name: user.name, username: user.username, _id: user._id });
                    callback({ status: "success" })
                } else {
                    console.log("to or from cant be empty");
                    socket.to(socket.id).emit("outgoing-request-fail", { "error": "to or from cant be empty" })
                }
            } catch (err) {
                console.log(err);
                socket.to(socket.id).emit("reject-request-fail", err)
            }
        })

        socket.on("accept-request", async (data, callback) => {
            try {
                if (data.to && data.from) {
                    const user = await userModel.findOneAndUpdate({ _id: data.to },
                        { "$pull": { "friends.incoming": data.from }, "$push": { "friends.friends": data.from } }).select("name username").lean().exec()

                    const user1 = await userModel.findByIdAndUpdate({ _id: data.from },
                        { "$pull": { "friends.outgoing": user._id }, "$push": { "friends.friends": user._id } }).select("name username socketId").lean().exec()

                    socket.to(user1.socketId).emit("request-accepted", { name: user.name, username: user.username, _id: user._id });
                    callback({ status: "success" })
                } else {
                    console.log("to or from cant be empty");
                    socket.to(socket.id).emit("outgoing-request-fail", { "error": "to or from cant be empty" })
                }
            } catch (err) {
                console.log(err);
                socket.to(socket.id).emit("reject-request-fail", err)
            }
        })


        socket.on("disconnect", async (data) => {
            await userModel.findOneAndUpdate({ socketId: socket.id }, { "$set": { active: false, socketId: "" } })
        })
    })
}


module.exports = socketService;