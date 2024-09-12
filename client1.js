import { io } from 'socket.io-client';
import readline from 'readline';

// Connect to the Socket.IO server
const socket = io('http://localhost:4000/socket.io');

// Handle successful connection
socket.on('connect', () => {
    console.log('Connected to server with ID:', socket.id);
});

// Listen for new messages
socket.on('newMessage', (data) => {
    console.log('New message received:', data);
});

// Handle connection errors
socket.on('connect_error', (error) => {
    console.log('Connection error:', error);
});

// Set up readline for user input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

// Function to send messages
function sendMessage() {
    rl.question("You: ", (content) => {
        if (content) {
            const messageData = { senderId: '60d21b4667d0d8992e610c85', content };
            socket.emit('sendMessage', messageData); // Emit the entire messageData object
            console.log('Sent message:', messageData);
        }
        sendMessage(); // Call again to allow for continuous messaging
    });
}

// Start sending messages
sendMessage();

// Handle disconnection
socket.on('disconnect', (reason) => {
    console.log('Disconnected:', reason);
});
