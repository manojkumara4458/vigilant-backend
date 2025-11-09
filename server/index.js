// server/index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();

// ------------------ Import routes ------------------
const authRoutes = require('./routes/auth');
const incidentRoutes = require('./routes/incidents');
const alertRoutes = require('./routes/alerts');
const userRoutes = require('./routes/users');
const safetyRoutes = require('./routes/safety');
const voteRoutes = require('./routes/vote'); // <-- vote routes

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// ------------------ Middleware ------------------
app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true); // allow mobile apps/curl
    const allowed = [process.env.CLIENT_URL, 'http://localhost:3000'].filter(Boolean);
    if (allowed.includes(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ------------------ Routes ------------------
app.use('/api/auth', authRoutes);
app.use('/api/incidents', incidentRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/users', userRoutes);
app.use('/api/safety', safetyRoutes);
app.use('/api/votes', voteRoutes); // <-- vote routes

app.get('/', (req, res) => res.send('Backend is running 🚀'));

// ------------------ Health Check ------------------
app.get('/api/health', async (req, res) => {
  const dbState = mongoose.connection.readyState; 
  // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
  if (dbState === 1) {
    return res.status(200).json({ status: 'OK', message: 'Backend + MongoDB are healthy' });
  } else {
    return res.status(200).json({ status: 'OK', message: `Backend running, MongoDB state = ${dbState}` });
  }
});

// ------------------ Socket.IO ------------------
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('join-neighborhood', (neighborhoodId) => {
    socket.join(`neighborhood-${neighborhoodId}`);
  });

  socket.on('new-incident', (incident) => {
    socket.to(`neighborhood-${incident.neighborhoodId}`).emit('incident-alert', incident);
  });

  socket.on('vote-updated', (voteData) => {
    // voteData should include: { incidentId, neighborhoodId, trueVotes, falseVotes }
    socket.to(`neighborhood-${voteData.neighborhoodId}`).emit('vote-updated', voteData);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// ------------------ Error & 404 ------------------
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err?.stack || err);
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? (err?.message || err) : 'Internal server error'
  });
});

app.use('*', (req, res) => res.status(404).json({ error: 'Route not found' }));

// ------------------ MongoDB Connection ------------------
async function connectMongo() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.warn('MONGODB_URI not set — skipping DB connection');
    return;
  }

  try {
    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message || err);
    setTimeout(connectMongo, 5000);
  }

  mongoose.connection.on('disconnected', () => {
    console.warn('⚠️ MongoDB disconnected. Trying to reconnect...');
    setTimeout(connectMongo, 5000);
  });
}

connectMongo();

// ------------------ Start server ------------------
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚨 Neighborhood Safety Alert System Server running on port ${PORT}`);
  console.log(`📡 Socket.IO server ready for real-time connections`);
});

// ------------------ Graceful handlers ------------------
process.on('unhandledRejection', (reason) => console.error('Unhandled Rejection:', reason));
process.on('uncaughtException', (err) => console.error('Uncaught Exception:', err));

module.exports = { app, io };
