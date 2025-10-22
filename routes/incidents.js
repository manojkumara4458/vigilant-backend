// client/routes/incidents.js
const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');

const Incident = require('../models/Incident');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

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

      const { title, description, type, severity, location, isAnonymous=false, media={images:[],videos:[]}, tags=[] } = req.body;

      // Convert coordinates to numbers
      location.coordinates = location.coordinates.map(Number);
      const [lng, lat] = location.coordinates;

      // Create incident without referencing Neighborhood
      const incident = new Incident({
        title,
        description,
        type,
        severity,
        location: { type: 'Point', coordinates: [lng, lat] }, // no neighborhood reference
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
        global.io.to(`new-incident`).emit('new-incident', {
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

module.exports = router;
