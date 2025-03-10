const Message = require("../model/messages")

exports.getMessage= async(req,res)=>{
    const { senderId, receiverId } = req.params;
    try {
        const messages = await Message.find({
            $or: [
                { senderId, receiverId },
                { senderId: receiverId, receiverId: senderId }
            ]
        }).sort({ timestamp: 1 });
        
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch messages" });
    }
}
// Decrypt function

exports.postMessage = async(req,res)=>{
    const { senderId, receiverId, message } = req.body;
    try {
        const newMessage = new Message({ senderId, receiverId, message });
        await newMessage.save();
        res.status(201).json(newMessage);
    } catch (error) {
        res.status(500).json({ error: "Failed to send message" });
    }
}