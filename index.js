const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
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

// Minimal working CORS setup FIRST
const allowedOrigins = [
  'https://neighborhood-safety-alert-system-c8.vercel.app',
  'https://neighborhood-safety-alert-system-c87h-pb68lqio5.vercel.app',
  'http://localhost:3000'
];

const corsOptions = {
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// REMOVE helmet and rate limiting for CORS debugging
// app.use(helmet());
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100 // limit each IP to 100 requests per windowMs
// });
// app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/neighborhood-safety')
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/incidents', incidentRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/users', userRoutes);
app.use('/api/safety', safetyRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Neighborhood Safety Alert System is running' });
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // Join neighborhood room
  socket.on('join-neighborhood', (neighborhoodId) => {
    socket.join(`neighborhood-${neighborhoodId}`);
    console.log(`User joined neighborhood: ${neighborhoodId}`);
  });

  // Handle new incident reports
  socket.on('new-incident', (incident) => {
    socket.to(`neighborhood-${incident.neighborhoodId}`).emit('incident-alert', incident);
  });

  // Handle user location updates
  socket.on('update-location', (data) => {
    socket.userLocation = data.location;
    socket.neighborhoodId = data.neighborhoodId;
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler should be last
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚨 Neighborhood Safety Alert System Server running on port ${PORT}`);
  console.log(`📡 Socket.IO server ready for real-time connections`);
});

module.exports = { app, io }; 