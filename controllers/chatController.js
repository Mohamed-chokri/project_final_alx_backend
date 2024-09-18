import Message from "../models/Messages.js";

class chatController{
    static async getMessages(limit) {
        try {
            return await Message.find().sort('-createdAt').limit(limit); //this is assumtion i will modify letter
        } catch (err) {
            console.error('Error saving message:', err);
        }
    };

// we have 2 ways for message sending normal from http and another realtime socket
    static async createMessage(content, senderId){
            const message = new Message({sender: senderId, content});
            await message.save();
            return message
    };
}

export default chatController;