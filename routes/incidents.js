const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Incident = require('../models/Incident');
const User = require('../models/User');
const Neighborhood = require('../models/Neighborhood');
const { auth, optionalAuth, authorize } = require('../middleware/auth');
const { io } = require('../index');

const router = express.Router();

/**
 * =========================
 * POST /api/incidents
 * Report a new incident
 * =========================
 */
router.post('/', auth, [
  body('title').trim().isLength({ min: 5, max: 200 }),
  body('description').trim().isLength({ min: 10, max: 2000 }),
  body('type').isIn([
    'theft', 'vandalism', 'assault', 'suspicious-activity', 'fire', 
    'accident', 'medical-emergency', 'road-hazard', 'broken-infrastructure',
    'noise-disturbance', 'traffic-violation', 'other'
  ]),
  body('severity').isIn(['low', 'medium', 'high', 'critical']),
  body('location.type').equals('Point'),
  body('location.coordinates').isArray({ min: 2, max: 2 }),
  body('location.coordinates.*').isFloat(),
  body('isAnonymous').optional().isBoolean()
], async (req, res) => {
  console.log('POST /api/incidents body:', JSON.stringify(req.body, null, 2));

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

    // Ensure coordinates are numbers
    location.coordinates = location.coordinates.map(coord => Number(coord));

    // Find neighborhood by proximity (5km)
    let neighborhood = await Neighborhood.findOne({
      'boundaries.center': {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: location.coordinates
          },
          $maxDistance: 5000
        }
      }
    });

    if (!neighborhood) {
      neighborhood = new Neighborhood({
        name: 'Default Neighborhood',
        city: location.address?.city || 'Unknown City',
        state: location.address?.state || 'Unknown State',
        boundaries: {
          center: { type: 'Point', coordinates: location.coordinates },
          radius: 2
        }
      });
      await neighborhood.save();
    }

    // Create incident
    const incident = new Incident({
      title,
      description,
      type,
      severity,
      location: { ...location, neighborhood: neighborhood._id },
      reporter: req.user._id,
      isAnonymous,
      media,
      tags
    });

    await incident.save();

    // Update user stats
    await User.findByIdAndUpdate(req.user._id, { $inc: { 'stats.reportsSubmitted': 1 } });

    // Update neighborhood stats
    await Neighborhood.findByIdAndUpdate(neighborhood._id, {
      $inc: { 'stats.totalIncidents': 1, 'stats.incidentsThisMonth': 1 }
    });

    // Emit real-time alert to neighborhood
    if (io && io.to) {
      io.to(`neighborhood-${neighborhood._id}`).emit('new-incident', {
        id: incident._id,
        title: incident.title,
        type: incident.type,
        severity: incident.severity,
        location: incident.location,
        createdAt: incident.createdAt
      });
    }

    // Populate reporter info
    await incident.populate('reporter', 'firstName lastName');

    res.status(201).json(incident);
  } catch (error) {
    console.error('Create incident error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});


/**
 * =========================
 * GET /api/incidents
 * Get incidents with filters
 * =========================
 */
router.get('/', optionalAuth, [
  query('lat').optional().isFloat({ min: -90, max: 90 }),
  query('lng').optional().isFloat({ min: -180, max: 180 }),
  query('radius').optional().isFloat({ min: 0.1, max: 50 }),
  query('type').optional().isIn([
    'theft', 'vandalism', 'assault', 'suspicious-activity', 'fire', 
    'accident', 'medical-emergency', 'road-hazard', 'broken-infrastructure',
    'noise-disturbance', 'traffic-violation', 'other'
  ]),
  query('severity').optional().isIn(['low', 'medium', 'high', 'critical']),
  query('status').optional().isIn(['active', 'resolved', 'false-alarm', 'expired']),
  query('verified').optional().isBoolean(),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const {
      lat,
      lng,
      radius = 5,
      type,
      severity,
      status = 'active',
      verified,
      page = 1,
      limit = 20
    } = req.query;

    const skip = (page - 1) * limit;
    const filter = { status };

    if (lat && lng) {
      filter['location'] = {
        $near: {
          $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: radius * 1609.34 // miles → meters
        }
      };
    }

    if (type) filter.type = type;
    if (severity) filter.severity = severity;
    if (verified !== undefined) filter['verification.status'] = verified ? 'verified' : 'pending';

    const incidents = await Incident.find(filter)
      .populate('reporter', 'firstName lastName')
      .populate('location.neighborhood', 'name city state')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Incident.countDocuments(filter);

    if (req.user) {
      incidents.forEach(incident => {
        const { upvoted, downvoted } = incident.hasUserVoted(req.user._id);
        incident.userVote = upvoted ? 'upvote' : downvoted ? 'downvote' : null;
      });
    }

    res.json({
      incidents,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get incidents error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});


/**
 * =========================
 * GET /api/incidents/:id
 * Get incident by ID
 * =========================
 */
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const incident = await Incident.findById(req.params.id)
      .populate('reporter', 'firstName lastName')
      .populate('location.neighborhood', 'name city state')
      .populate('verification.verifiedBy', 'firstName lastName')
      .populate('resolvedBy', 'firstName lastName')
      .populate('community.comments.user', 'firstName lastName');

    if (!incident) return res.status(404).json({ error: 'Incident not found' });

    if (req.user) {
      const { upvoted, downvoted } = incident.hasUserVoted(req.user._id);
      incident.userVote = upvoted ? 'upvote' : downvoted ? 'downvote' : null;
    }

    res.json(incident);
  } catch (error) {
    console.error('Get incident error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});


/**
 * =========================
 * PUT /api/incidents/:id
 * Update incident (moderators/admins only)
 * =========================
 */
router.put('/:id', auth, authorize('moderator', 'admin', 'first-responder'), async (req, res) => {
  try {
    const { verification, status, resolutionNotes } = req.body;

    const incident = await Incident.findById(req.params.id);
    if (!incident) return res.status(404).json({ error: 'Incident not found' });

    const updateFields = {};

    if (verification) {
      updateFields.verification = {
        ...incident.verification,
        ...verification,
        verifiedBy: req.user._id,
        verifiedAt: new Date()
      };
    }

    if (status) {
      updateFields.status = status;
      if (status === 'resolved') {
        updateFields.resolvedAt = new Date();
        updateFields.resolvedBy = req.user._id;
      }
    }

    if (resolutionNotes) updateFields.resolutionNotes = resolutionNotes;

    const updatedIncident = await Incident.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true, runValidators: true }
    ).populate('reporter', 'firstName lastName');

    res.json(updatedIncident);
  } catch (error) {
    console.error('Update incident error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});


/**
 * =========================
 * POST /api/incidents/:id/vote
 * Vote on incident
 * =========================
 */
router.post('/:id/vote', auth, [
  body('voteType').isIn(['upvote', 'downvote'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { voteType } = req.body;
    const incident = await Incident.findById(req.params.id);
    if (!incident) return res.status(404).json({ error: 'Incident not found' });

    incident.addVote(req.user._id, voteType);
    await incident.save();

    res.json({ voteCount: incident.voteCount, userVote: voteType });
  } catch (error) {
    console.error('Vote error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});


/**
 * =========================
 * POST /api/incidents/:id/comments
 * Add comment to incident
 * =========================
 */
router.post('/:id/comments', auth, [
  body('text').trim().isLength({ min: 1, max: 500 }),
  body('isAnonymous').optional().isBoolean()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { text, isAnonymous = false } = req.body;
    const incident = await Incident.findById(req.params.id);
    if (!incident) return res.status(404).json({ error: 'Incident not found' });

    incident.community.comments.push({ user: req.user._id, text, isAnonymous });
    await incident.save();
    await incident.populate('community.comments.user', 'firstName lastName');

    const newComment = incident.community.comments[incident.community.comments.length - 1];
    res.json(newComment);
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});


/**
 * =========================
 * GET /api/incidents/stats/summary
 * Get incident statistics
 * =========================
 */
router.get('/stats/summary', async (req, res) => {
  try {
    const { lat, lng, radius = 5 } = req.query;

    let locationFilter = {};
    if (lat && lng) {
      locationFilter['location'] = {
        $near: {
          $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: radius * 1609.34
        }
      };
    }

    const stats = await Incident.aggregate([
      { $match: { ...locationFilter, status: 'active' } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          byType: { $push: '$type' },
          bySeverity: { $push: '$severity' }
        }
      }
    ]);

    const typeStats = {};
    const severityStats = {};

    if (stats.length > 0) {
      stats[0].byType.forEach(type => { typeStats[type] = (typeStats[type] || 0) + 1; });
      stats[0].bySeverity.forEach(sev => { severityStats[sev] = (severityStats[sev] || 0) + 1; });
    }

    res.json({ total: stats.length > 0 ? stats[0].total : 0, byType: typeStats, bySeverity: severityStats });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
