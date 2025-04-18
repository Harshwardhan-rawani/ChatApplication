const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    senderId: String,
    receiverId: String,
    message: String,
    date : String,
    time : String,
    read: { type: Boolean, default: false },
    timestamp: { type: Date, default: Date.now }
});

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
