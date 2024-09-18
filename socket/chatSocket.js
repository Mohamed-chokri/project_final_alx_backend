import { Server } from 'socket.io';
import chatController from "../controllers/chatController.js";
export default function (httpServer) {
    const io = new Server(httpServer, {
        path: '/socket.io',
        cors: {
            origin: "*", methods: ["GET", "POST"]
        }},);

    io.on('connection', (socket) => {
        console.log('New client connected: ' + socket.id);

        socket.on('sendMessage', async (data) => {
            try {
                const { senderId, content } = data;
                const message = await chatController.createMessage(content, senderId);
                console.log('Message created:', message); // Log created message
                io.emit('newMessage', message);
            } catch (err) {
                console.error('Error saving message:', err);
            }
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected: ' + socket.id);
        });
        socket.on('error', (error) => {
            console.error('WebSocket error: ', error);
        });
    });

    return io;
}