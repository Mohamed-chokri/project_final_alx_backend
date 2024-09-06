import socketIo from 'socket.io';
import Message from '../models/Messages.js'

export default function (server) {
    const io = socketIo(server);

    io.on('connection', (socket) => {
        console.log('New client connected'+ socket.id);
    });
    socket.on('sendMessage', async (data) => {
        try {
            const {userId, content} = data;
            const message = new Message({user: userId, content});
            await message.save();
            io.emit('newMessage', message);
        } catch (err) {
                console.error('Error saving message:', err);
            }
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected')
    });

    return io;
}
