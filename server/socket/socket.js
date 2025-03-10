const { Server } = require("socket.io");
const Message = require("../model/messages");

const users = {}; 
const onlineUsers = {}; 

const setupSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    io.on("connection", (socket) => {
        console.log("A user connected:", socket.id);

        socket.on("registerUser", ({ userId, name }) => {
            if (!userId || !name) {
                console.error("Registration failed: Missing userId or name");
                return;
            }
            users[userId] = socket.id;
            onlineUsers[userId] = "online" ; 

            console.log(`User ${name} (ID: ${userId}) registered with socket ${socket.id}`);
            io.emit("updateUserStatus", { onlineUsers });
        });

        socket.on("sendMessage", async ({ senderId, receiverId, message ,date,time }) => {
            if (!senderId || !receiverId || !message) {
                console.error("sendMessage failed: Missing senderId, receiverId, or message");
                return;
            }

            try {
                // Save message to MongoDB
                const newMessage = new Message({ senderId, receiverId, message,date,time });
              
                await newMessage.save();

                const receiverSocketId = users[receiverId];
                if (receiverSocketId && senderId!==receiverId) {
                    io.to(receiverSocketId).emit("receiveMessage", { senderId, message,date,time });
                    console.log(`Message sent from ${senderId} to ${receiverId}: "${message}"`);
                } else {
                    console.warn(`User ${receiverId} is offline or not registered`);
                }
            } catch (error) {
                console.error("Error saving message:", error);
            }
        });

        socket.on("disconnect", () => {
            const disconnectedUser = Object.keys(users).find(userId => users[userId] === socket.id);
            if (disconnectedUser) {
                console.log(`User ${disconnectedUser} disconnected`);
                delete users[disconnectedUser];
                delete onlineUsers[disconnectedUser];

                // Notify all clients about the updated user status
                io.emit("updateUserStatus", { userId: disconnectedUser,onlineUsers });
            }
        });
    });
};

module.exports = setupSocket;