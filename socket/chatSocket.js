import { Server } from 'socket.io';
import User from "../models/Users.js";
import chatController from "../controllers/chatController.js";
export default function (server) {
    const io = new Server(server);

    io.on('connection', (socket) => {
        console.log('New client connected: ' + socket.id);

        socket.on('sendMessage', async (data) => {
            try {
                const { senderId, content } = data;
                const message = await chatController.createMessage(content, senderId);
                io.emit('newMessage', message);
            } catch (err) {
                console.error('Error saving message:', err);
            }
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected: ' + socket.id);
        });
    });

    return io;
}
