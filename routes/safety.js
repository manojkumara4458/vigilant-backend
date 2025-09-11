const express = require('express');
const { body, validationResult } = require('express-validator');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Emergency contacts data
const emergencyContacts = {
  police: {
    name: 'Local Police Department',
    phone: '911',
    description: 'Emergency police services'
  },
  fire: {
    name: 'Fire Department',
    phone: '911',
    description: 'Emergency fire services'
  },
  ambulance: {
    name: 'Emergency Medical Services',
    phone: '911',
    description: 'Emergency medical services'
  },
  poison: {
    name: 'Poison Control Center',
    phone: '1-800-222-1222',
    description: '24/7 poison information and emergency treatment'
  },
  suicide: {
    name: 'National Suicide Prevention Lifeline',
    phone: '988',
    description: '24/7 suicide prevention and crisis support'
  }
};

// Safety tips data
const safetyTips = [
  {
    category: 'general',
    title: 'Stay Alert and Aware',
    tips: [
      'Always be aware of your surroundings',
      'Trust your instincts - if something feels wrong, it probably is',
      'Keep your phone charged and easily accessible',
      'Share your location with trusted friends or family when traveling alone'
    ]
  },
  {
    category: 'home',
    title: 'Home Security',
    tips: [
      'Install and maintain working smoke detectors',
      'Keep doors and windows locked',
      'Use motion-sensor lights around your property',
      'Get to know your neighbors',
      'Consider installing a security system'
    ]
  },
  {
    category: 'walking',
    title: 'Walking Safety',
    tips: [
      'Walk in well-lit areas',
      'Stay on main streets when possible',
      'Avoid walking alone at night',
      'Carry a personal safety device',
      'Keep your head up and phone down'
    ]
  },
  {
    category: 'driving',
    title: 'Vehicle Safety',
    tips: [
      'Always lock your car doors',
      'Keep valuables out of sight',
      'Park in well-lit areas',
      'Have your keys ready before reaching your car',
      'Check your surroundings before entering/exiting your vehicle'
    ]
  },
  {
    category: 'emergency',
    title: 'Emergency Preparedness',
    tips: [
      'Have an emergency kit ready',
      'Know your evacuation routes',
      'Keep important documents in a safe place',
      'Have a family emergency plan',
      'Stay informed about local emergency procedures'
    ]
  }
];

// @route   GET /api/safety/emergency-contacts
// @desc    Get emergency contact information
// @access  Public
router.get('/emergency-contacts', async (req, res) => {
  try {
    res.json(emergencyContacts);
  } catch (error) {
    console.error('Get emergency contacts error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/safety/tips
// @desc    Get safety tips by category
// @access  Public
router.get('/tips', async (req, res) => {
  try {
    const { category } = req.query;
    
    if (category) {
      const categoryTips = safetyTips.find(tip => tip.category === category);
      if (!categoryTips) {
        return res.status(404).json({ error: 'Category not found' });
      }
      res.json(categoryTips);
    } else {
      res.json(safetyTips);
    }
  } catch (error) {
    console.error('Get safety tips error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/safety/tips/categories
// @desc    Get available safety tip categories
// @access  Public
router.get('/tips/categories', async (req, res) => {
  try {
    const categories = safetyTips.map(tip => ({
      category: tip.category,
      title: tip.title
    }));
    res.json(categories);
  } catch (error) {
    console.error('Get tip categories error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/safety/panic-alert
// @desc    Send panic alert (emergency feature)
// @access  Private
router.post('/panic-alert', auth, [
  body('location.coordinates.lat').isFloat({ min: -90, max: 90 }),
  body('location.coordinates.lng').isFloat({ min: -180, max: 180 }),
  body('message').optional().trim().isLength({ max: 500 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { location, message } = req.body;

    // TODO: Implement panic alert system
    // This would typically:
    // 1. Send immediate alerts to emergency contacts
    // 2. Notify nearby first responders
    // 3. Send SMS/email to emergency contacts
    // 4. Log the alert for follow-up

    const panicData = {
      userId: req.user.id,
      user: {
        name: `${req.user.firstName} ${req.user.lastName}`,
        phone: req.user.phone
      },
      location,
      message: message || 'Emergency assistance needed',
      timestamp: new Date()
    };

    // For now, just return success
    res.json({
      message: 'Panic alert sent successfully',
      alertId: Date.now().toString(),
      data: panicData
    });
  } catch (error) {
    console.error('Panic alert error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/safety/resources
// @desc    Get community safety resources
// @access  Public
router.get('/resources', async (req, res) => {
  try {
    const resources = {
      localServices: [
        {
          name: 'Neighborhood Watch Program',
          description: 'Join your local neighborhood watch program',
          contact: 'Contact your local police department'
        },
        {
          name: 'Community Emergency Response Team (CERT)',
          description: 'Volunteer emergency response training',
          contact: 'Contact your local emergency management office'
        },
        {
          name: 'Local Crime Prevention Programs',
          description: 'Learn about crime prevention in your area',
          contact: 'Contact your local police department'
        }
      ],
      onlineResources: [
        {
          name: 'FBI Crime Statistics',
          url: 'https://www.fbi.gov/services/cjis/ucr',
          description: 'National crime statistics and data'
        },
        {
          name: 'Department of Homeland Security',
          url: 'https://www.dhs.gov/emergency-preparedness',
          description: 'Emergency preparedness information'
        },
        {
          name: 'Red Cross Safety Tips',
          url: 'https://www.redcross.org/get-help/how-to-prepare-for-emergencies.html',
          description: 'Comprehensive safety and emergency preparedness'
        }
      ],
      apps: [
        {
          name: 'FEMA App',
          description: 'Federal Emergency Management Agency mobile app',
          features: ['Emergency alerts', 'Disaster resources', 'Safety tips']
        },
        {
          name: 'Red Cross Emergency App',
          description: 'American Red Cross emergency app',
          features: ['Emergency alerts', 'First aid information', 'Shelter locations']
        },
        {
          name: 'Citizen App',
          description: 'Real-time safety alerts and incident reports',
          features: ['Live incident updates', 'Safety alerts', 'Community reports']
        }
      ]
    };

    res.json(resources);
  } catch (error) {
    console.error('Get safety resources error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/safety/weather
// @desc    Get current weather and safety conditions
// @access  Public
router.get('/weather', async (req, res) => {
  try {
    const { lat, lng } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ error: 'Latitude and longitude required' });
    }

    // TODO: Integrate with weather API (OpenWeatherMap, WeatherAPI, etc.)
    // For now, return mock data
    const weatherData = {
      current: {
        temperature: 72,
        condition: 'Partly Cloudy',
        humidity: 65,
        windSpeed: 8,
        visibility: 10
      },
      alerts: [
        {
          type: 'weather',
          severity: 'moderate',
          title: 'Heat Advisory',
          description: 'High temperatures expected. Stay hydrated and avoid prolonged outdoor activity.',
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000)
        }
      ],
      safetyConditions: {
        drivingConditions: 'good',
        walkingConditions: 'good',
        outdoorActivityRisk: 'low'
      }
    };

    res.json(weatherData);
  } catch (error) {
    console.error('Get weather error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/safety/check-in
// @desc    User safety check-in
// @access  Private
router.post('/check-in', auth, [
  body('location.coordinates.lat').isFloat({ min: -90, max: 90 }),
  body('location.coordinates.lng').isFloat({ min: -180, max: 180 }),
  body('status').isIn(['safe', 'concerned', 'unsafe']),
  body('message').optional().trim().isLength({ max: 500 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { location, status, message } = req.body;

    const checkIn = {
      userId: req.user.id,
      user: {
        name: `${req.user.firstName} ${req.user.lastName}`,
        phone: req.user.phone
      },
      location,
      status,
      message,
      timestamp: new Date()
    };

    // TODO: Store check-in in database
    // TODO: Notify emergency contacts if status is 'unsafe'

    res.json({
      message: 'Safety check-in recorded',
      checkInId: Date.now().toString(),
      data: checkIn
    });
  } catch (error) {
    console.error('Safety check-in error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 