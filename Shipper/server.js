const express = require('express');
const fs = require('fs');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
const { runConsumer } = require('./consumer');

const loginRoutes = require('./route/login');
const shipRoutes = require('./route/ship');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
    }
});
const PORT = 3006;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// View + static
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/login', loginRoutes);
app.use('/ship', shipRoutes);

// Default redirect to login
app.get('/', (req, res) => res.redirect('/login'));

// WebSocket
io.on('connection', (socket) => {
    console.log('📡 Client connected:', socket.id);
    socket.on('disconnect', () => {
        console.log('❌ Client disconnected:', socket.id);
    });
});

// Kafka consumer
runConsumer(io).catch(console.error);

// Start server
server.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
