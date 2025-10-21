const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Incident = require('../models/Incident');
const { auth } = require('../middleware/auth');
const { io } = require('../index');

const router = express.Router();

// @route   POST /api/alerts/test
// @desc    Send test notification
// @access  Private
router.post('/test', auth, async (req, res) => {
  try {
    // Send test notification to user
    io.to(req.user.id).emit('test-notification', {
      title: 'Test Alert',
      message: 'This is a test notification from the Neighborhood Safety Alert System',
      type: 'test',
      timestamp: new Date()
    });

    res.json({ message: 'Test notification sent' });
  } catch (error) {
    console.error('Test notification error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/alerts/incident
// @desc    Send incident alert to nearby users
// @access  Private
router.post('/incident', auth, [
  body('incidentId').isMongoId(),
  body('type').isIn(['new', 'update', 'resolved'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { incidentId, type } = req.body;

    const incident = await Incident.findById(incidentId)
      .populate('location.neighborhood', 'name');

    if (!incident) {
      return res.status(404).json({ error: 'Incident not found' });
    }

    // Find users within notification radius
    const users = await User.find({
      'notificationPreferences.push.enabled': true,
      'notificationPreferences.push.types': 'incidents',
      'location.coordinates': {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [incident.location.coordinates.lng, incident.location.coordinates.lat]
          },
          $maxDistance: 5 * 1609.34 // 5 miles in meters
        }
      }
    });

    // Send notifications
    const notificationData = {
      incidentId: incident._id,
      title: incident.title,
      type: incident.type,
      severity: incident.severity,
      location: incident.location,
      alertType: type,
      timestamp: new Date()
    };

    users.forEach(user => {
      io.to(user._id.toString()).emit('incident-alert', notificationData);
    });

    // Update incident alert status
    await Incident.findByIdAndUpdate(incidentId, {
      'alerts.pushSent': true,
      'alerts.sentAt': new Date()
    });

    res.json({ 
      message: `Alert sent to ${users.length} users`,
      recipients: users.length
    });
  } catch (error) {
    console.error('Send incident alert error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/alerts/history
// @desc    Get user's alert history
// @access  Private
router.get('/history', auth, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    // Get incidents that the user has been notified about
    const incidents = await Incident.find({
      'alerts.pushSent': true,
      'location.coordinates': {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [req.user.address.coordinates.lng, req.user.address.coordinates.lat]
          },
          $maxDistance: req.user.notificationPreferences.radius * 1609.34
        }
      }
    })
    .populate('reporter', 'firstName lastName')
    .sort({ 'alerts.sentAt': -1 })
    .skip(skip)
    .limit(parseInt(limit));

    const total = await Incident.countDocuments({
      'alerts.pushSent': true,
      'location.coordinates': {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [req.user.address.coordinates.lng, req.user.address.coordinates.lat]
          },
          $maxDistance: req.user.notificationPreferences.radius * 1609.34
        }
      }
    });

    res.json({
      alerts: incidents,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get alert history error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/alerts/emergency
// @desc    Send emergency alert (first responders only)
// @access  Private
router.post('/emergency', auth, [
  body('title').trim().isLength({ min: 5, max: 200 }),
  body('message').trim().isLength({ min: 10, max: 1000 }),
  body('severity').isIn(['high', 'critical']),
  body('location.coordinates.lat').isFloat({ min: -90, max: 90 }),
  body('location.coordinates.lng').isFloat({ min: -180, max: 180 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, message, severity, location } = req.body;

    // Find all users in the area with emergency notifications enabled
    const users = await User.find({
      'notificationPreferences.sms.enabled': true,
      'notificationPreferences.sms.types': 'emergency',
      'location.coordinates': {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [location.coordinates.lng, location.coordinates.lat]
          },
          $maxDistance: 10 * 1609.34 // 10 miles for emergency alerts
        }
      }
    });

    const emergencyData = {
      title,
      message,
      severity,
      location,
      sender: req.user.id,
      timestamp: new Date()
    };

    // Send emergency notifications
    users.forEach(user => {
      io.to(user._id.toString()).emit('emergency-alert', emergencyData);
    });

    res.json({ 
      message: `Emergency alert sent to ${users.length} users`,
      recipients: users.length
    });
  } catch (error) {
    console.error('Send emergency alert error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 