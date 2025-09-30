const express = require('express');
const { query, validationResult } = require('express-validator');
const User = require('../models/User');
const Incident = require('../models/Incident');
const Neighborhood = require('../models/Neighborhood');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/users/profile/:id
// @desc    Get user profile by ID
// @access  Public
router.get('/profile/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('neighborhood', 'name city state')
      .select('-password -email -phone');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/users/community
// @desc    Get community members in user's area
// @access  Private
router.get('/community', auth, async (req, res) => {
  try {
    // Return all users, including the current user
    const usersRaw = await User.find({})
      .select('firstName lastName email phone profile stats lastActive address role status createdAt');
    // Map users to include all expected fields with defaults
    const users = usersRaw.map(user => ({
      id: user._id,
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      phone: user.phone || '',
      avatar: (user.profile && user.profile.avatar) ? user.profile.avatar : (user.firstName ? user.firstName[0] : '?'),
      area: (user.address && user.address.city) ? user.address.city : '',
      neighborhood: (user.address && user.address.neighborhood) ? user.address.neighborhood : '',
      role: user.role || 'Member',
      status: user.status || 'active',
      joinedDate: user.createdAt || (user._id.getTimestamp ? user._id.getTimestamp() : new Date()),
      lastActive: user.lastActive || user.createdAt || (user._id.getTimestamp ? user._id.getTimestamp() : new Date()),
      incidentsReported: (user.stats && user.stats.reportsSubmitted) ? user.stats.reportsSubmitted : 0
    }));
    // Debug log
    console.log('API /api/users/community: returning', users.length, 'users');
    users.forEach(u => console.log('User:', u.id, u.email));
    res.json({ users });
  } catch (error) {
    console.error('Get community error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/users/leaderboard
// @desc    Get community leaderboard
// @access  Public
router.get('/leaderboard', [
  query('neighborhoodId').optional().isMongoId(),
  query('timeframe').optional().isIn(['week', 'month', 'year', 'all']),
  query('limit').optional().isInt({ min: 1, max: 50 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { neighborhoodId, timeframe = 'month', limit = 10 } = req.query;

    let dateFilter = {};
    if (timeframe !== 'all') {
      const now = new Date();
      switch (timeframe) {
        case 'week':
          dateFilter = { $gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) };
          break;
        case 'month':
          dateFilter = { $gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) };
          break;
        case 'year':
          dateFilter = { $gte: new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000) };
          break;
      }
    }

    let neighborhoodFilter = {};
    if (neighborhoodId) {
      neighborhoodFilter = { neighborhood: neighborhoodId };
    }

    const leaderboard = await User.aggregate([
      { $match: neighborhoodFilter },
      {
        $lookup: {
          from: 'incidents',
          localField: '_id',
          foreignField: 'reporter',
          pipeline: [
            { $match: dateFilter },
            { $count: 'count' }
          ],
          as: 'reports'
        }
      },
      {
        $addFields: {
          reportCount: { $arrayElemAt: ['$reports.count', 0] },
          communityScore: {
            $add: [
              { $multiply: [{ $ifNull: ['$reportCount', 0] }, 10] },
              { $multiply: [{ $ifNull: ['$stats.reportsVerified', 0] }, 20] },
              { $ifNull: ['$stats.communityScore', 0] }
            ]
          }
        }
      },
      { $sort: { communityScore: -1 } },
      { $limit: parseInt(limit) },
      {
        $project: {
          firstName: 1,
          lastName: 1,
          profile: 1,
          stats: 1,
          reportCount: 1,
          communityScore: 1
        }
      }
    ]);

    res.json(leaderboard);
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/users/stats
// @desc    Get user statistics
// @access  Private
router.get('/stats', auth, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user's incident reports
    const userIncidents = await Incident.find({ reporter: userId });
    
    // Get incidents in user's area
    const nearbyIncidents = await Incident.find({
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

    // Calculate statistics
    const stats = {
      reportsSubmitted: userIncidents.length,
      reportsVerified: userIncidents.filter(i => i.verification.status === 'verified').length,
      reportsThisMonth: userIncidents.filter(i => {
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        return i.createdAt >= monthAgo;
      }).length,
      nearbyIncidents: nearbyIncidents.length,
      nearbyIncidentsThisMonth: nearbyIncidents.filter(i => {
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        return i.createdAt >= monthAgo;
      }).length,
      averageResponseTime: 0, // TODO: Calculate from verification times
      communityRank: 0 // TODO: Calculate rank
    };

    res.json(stats);
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/users/location
// @desc    Update user location
// @access  Private
router.put('/location', auth, async (req, res) => {
  try {
    const { address } = req.body;
    if (!address) {
      return res.status(400).json({ error: 'Address is required' });
    }
    // Only update address, remove coordinates if present
    const updateData = { address };
    // Optionally, remove coordinates field if it exists
    updateData.$unset = { 'address.coordinates': '' };
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: { address }, $unset: { 'address.coordinates': '' } },
      { new: true, runValidators: true }
    ).populate('neighborhood', 'name city state');
    res.json(user);
  } catch (error) {
    console.error('Update location error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/users/search
// @desc    Search users by name
// @access  Private
router.get('/search', auth, [
  query('q').trim().isLength({ min: 2 }),
  query('limit').optional().isInt({ min: 1, max: 50 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { q, limit = 10 } = req.query;

    const users = await User.find({
      $or: [
        { firstName: { $regex: q, $options: 'i' } },
        { lastName: { $regex: q, $options: 'i' } }
      ],
      _id: { $ne: req.user.id }
    })
    .select('firstName lastName profile stats')
    .limit(parseInt(limit));

    res.json(users);
  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/users/admin/all
// @desc    Get all users (admin only)
// @access  Private
router.get('/admin/all', auth, authorize('admin'), [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('role').optional().isIn(['resident', 'moderator', 'admin', 'first-responder']),
  query('verified').optional().isBoolean()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { page = 1, limit = 20, role, verified } = req.query;
    const skip = (page - 1) * limit;

    const filter = {};
    if (role) filter.role = role;
    if (verified !== undefined) filter.isVerified = verified;

    const users = await User.find(filter)
      .populate('neighborhood', 'name city state')
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(filter);

    res.json({
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/users/admin/:id/role
// @desc    Update user role (admin only)
// @access  Private
router.put('/admin/:id/role', auth, authorize('admin'), async (req, res) => {
  try {
    const { role } = req.body;

    if (!['resident', 'moderator', 'admin', 'first-responder'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 