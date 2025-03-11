// server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  }
});

// Store connected clients
const clients = new Map();

io.on('connection', (socket) => {
  console.log('a user connected');
  
  // Handle client identification
  socket.on('client connected', (clientId) => {
    console.log(`Client identified: ${clientId}`);
    clients.set(socket.id, clientId);
  });
  
  // Handle chat messages with sender ID
  socket.on('chat message', (data) => {
    console.log(`Message from ${data.senderId}: ${data.text}`);
    // Broadcast the message to all clients
    io.emit('chat message', data);
  });
  
  socket.on('disconnect', () => {
    console.log('user disconnected');
    clients.delete(socket.id);
  });
});

server.listen(3001, () => {
  console.log('Socket.IO server running on port 3001');
});
