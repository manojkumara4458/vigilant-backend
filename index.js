// server/index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const incidentRoutes = require('./routes/incidents');
const alertRoutes = require('./routes/alerts');
const userRoutes = require('./routes/users');
const safetyRoutes = require('./routes/safety');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Basic CORS
app.use(cors({
  origin: function(origin, callback) {
    // allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    // allow whatever origins you need
    const allowed = [
      process.env.CLIENT_URL,
      'http://localhost:3000'
    ].filter(Boolean);
    if (allowed.includes(origin)) return callback(null, true);
    return callback(null, false);
  },
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes (safe to register before DB connects)
app.use('/api/auth', authRoutes);
app.use('/api/incidents', incidentRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/users', userRoutes);
app.use('/api/safety', safetyRoutes);

// Root and health endpoints
app.get('/', (req, res) => res.send('Backend is running 🚀'));
app.get('/api/health', (req, res) => res.json({ status: 'OK', message: 'Neighborhood Safety Alert System is running' }));

// Socket.IO handlers
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('join-neighborhood', (neighborhoodId) => {
    socket.join(`neighborhood-${neighborhoodId}`);
  });

  socket.on('new-incident', (incident) => {
    socket.to(`neighborhood-${incident.neighborhoodId}`).emit('incident-alert', incident);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Error & 404 handlers
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err && err.stack ? err.stack : err);
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? (err && err.message) : 'Internal server error'
  });
});
app.use('*', (req, res) => res.status(404).json({ error: 'Route not found' }));

// Start server immediately on Render's port
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚨 Neighborhood Safety Alert System Server running on port ${PORT}`);
  console.log(`📡 Socket.IO server ready for real-time connections`);
   console.log(`Server running on port ${PORT}`);
});

// Connect to MongoDB asynchronously so DB problems do NOT block server start
async function connectMongo() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.warn('MONGODB_URI not set — skipping DB connection (useful for debugging).');
    return;
  }

  try {
    // Mongoose v6/7 doesn't need useNewUrlParser/useUnifiedTopology options
    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message || err);
    // Do NOT exit; server remains up so Render can see a healthy process.
  }
}
connectMongo();

// graceful handlers
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
});
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});
module.exports = { app, io };
