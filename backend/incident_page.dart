const express = require('express');
const router = express.Router();
const { body, query, validationResult } = require('express-validator');

const Incident = require('../models/Incident');
const User = require('../models/User');
const { auth, optionalAuth } = require('../middleware/auth');

// =========================
// POST /api/incidents
// Report a new incident
// =========================
router.post(
  '/',
  auth,
  [
    body('title').trim().isLength({ min: 5, max: 200 }),
    body('description').trim().isLength({ min: 10, max: 2000 }),
    body('type').isIn([
      'theft','vandalism','assault','suspicious-activity','fire',
      'accident','medical-emergency','road-hazard','broken-infrastructure',
      'noise-disturbance','traffic-violation','other'
    ]),
    body('severity').isIn(['low','medium','high','critical']),
    body('location.type').equals('Point'),
    body('location.coordinates').isArray({ min: 2, max: 2 }),
    body('location.coordinates.*').isFloat(),
    body('isAnonymous').optional().isBoolean()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

      const {
        title,
        description,
        type,
        severity,
        location,
        isAnonymous = false,
        media = { images: [], videos: [] },
        tags = []
      } = req.body;

      // Convert coordinates to numbers
      location.coordinates = location.coordinates.map(Number);
      const [lng, lat] = location.coordinates;

      // Create incident without touching neighborhoods
      const incident = new Incident({
        title,
        description,
        type,
        severity,
        location: { type: 'Point', coordinates: [lng, lat] },
        reporter: req.user._id,
        isAnonymous,
        media,
        tags
      });

      await incident.save();

      // Update user stats
      await User.findByIdAndUpdate(req.user._id, { $inc: { 'stats.reportsSubmitted': 1 } });

      // Optional: emit real-time alert via socket.io if configured
      if (global.io && global.io.to) {
        global.io.to(`user-${req.user._id}`).emit('new-incident', {
          id: incident._id,
          title: incident.title,
          type: incident.type,
          severity: incident.severity,
          location: incident.location,
          createdAt: incident.createdAt
        });
      }

      await incident.populate('reporter', 'firstName lastName');

      res.status(201).json(incident);
    } catch (error) {
      console.error('Create incident error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// =========================
// GET /api/incidents
// Fetch incidents with optional filters
// =========================
router.get(
  '/',
  optionalAuth,
  [
    query('lat').optional().isFloat({ min: -90, max: 90 }),
    query('lng').optional().isFloat({ min: -180, max: 180 }),
    query('radius').optional().isFloat({ min: 0.1, max: 50 }),
    query('type').optional().isIn([
      'theft','vandalism','assault','suspicious-activity','fire',
      'accident','medical-emergency','road-hazard','broken-infrastructure',
      'noise-disturbance','traffic-violation','other'
    ]),
    query('severity').optional().isIn(['low','medium','high','critical']),
    query('status').optional().isIn(['active','resolved','false-alarm','expired']),
    query('verified').optional().isBoolean(),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 })
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

      const { lat, lng, radius = 5, type, severity, status = 'active', verified, page = 1, limit = 20 } = req.query;
      const skip = (page - 1) * limit;

      const filter = { status };

      if (lat && lng) {
        filter['location'] = {
          $near: {
            $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
            $maxDistance: radius * 1000
          }
        };
      }

      if (type) filter.type = type;
      if (severity) filter.severity = severity;
      if (verified !== undefined) filter['verification.status'] = verified ? 'verified' : 'pending';

      const incidents = await Incident.find(filter)
        .populate('reporter', 'firstName lastName')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

      const total = await Incident.countDocuments(filter);

      res.json({
        incidents,
        pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) }
      });
    } catch (error) {
      console.error('Get incidents error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

module.exports = router;
