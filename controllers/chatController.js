import Message from "../models/Messages.js";

class chatController{
    static async getMessages(limit) {
        try {
            const messages = await Message.find().sort('-createdAt').limit(limit); //this is assumtion i will modify letter
            res.json(messages)
        } catch (err) {
            res.status(500).json({ message: 'Error retrieving messages' });
        }
    };

// we have 2 ways for message sending normal from http and another realtime socket
    static async createMessage(content, senderId){
            const message = new Message({user: userId, content});
            await message.save();
            return message
    };
}
