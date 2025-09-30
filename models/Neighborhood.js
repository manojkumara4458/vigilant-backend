const mongoose = require('mongoose');

const neighborhoodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  boundaries: {
    center: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true }
    },
    radius: {
      type: Number,
      required: true,
      default: 2, // miles
      min: 0.1,
      max: 50
    },
    polygon: [{
      lat: Number,
      lng: Number
    }]
  },
  city: {
    type: String,
    required: true,
    trim: true
  },
  state: {
    type: String,
    required: true,
    trim: true
  },
  zipCode: {
    type: String,
    trim: true
  },
  country: {
    type: String,
    default: 'USA',
    trim: true
  },
  moderators: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  admins: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  stats: {
    totalResidents: { type: Number, default: 0 },
    activeResidents: { type: Number, default: 0 },
    totalIncidents: { type: Number, default: 0 },
    incidentsThisMonth: { type: Number, default: 0 },
    averageResponseTime: { type: Number, default: 0 }, // minutes
    safetyScore: { type: Number, default: 0 } // 0-100
  },
  settings: {
    isPublic: { type: Boolean, default: true },
    requireApproval: { type: Boolean, default: false },
    allowAnonymousReports: { type: Boolean, default: true },
    autoVerifyThreshold: { type: Number, default: 3 }, // number of reports needed
    emergencyContacts: [{
      name: String,
      phone: String,
      email: String,
      role: String
    }]
  },
  features: {
    hasPoliceStation: { type: Boolean, default: false },
    hasFireStation: { type: Boolean, default: false },
    hasHospital: { type: Boolean, default: false },
    hasSchool: { type: Boolean, default: false },
    hasPark: { type: Boolean, default: false }
  },
  alerts: {
    enabled: { type: Boolean, default: true },
    types: [{
      type: String,
      enum: ['incidents', 'community', 'emergency', 'updates']
    }],
    frequency: {
      type: String,
      enum: ['immediate', 'hourly', 'daily', 'weekly'],
      default: 'immediate'
    }
  },
  community: {
    description: String,
    rules: [String],
    meetingSchedule: String,
    contactInfo: {
      email: String,
      phone: String,
      website: String
    }
  }
}, {
  timestamps: true
});

// Indexes
neighborhoodSchema.index({ 'boundaries.center': '2dsphere' });
neighborhoodSchema.index({ city: 1, state: 1 });
neighborhoodSchema.index({ name: 'text', description: 'text' });

// Method to check if coordinates are within neighborhood
neighborhoodSchema.methods.containsLocation = function(lat, lng) {
  const { center, radius } = this.boundaries;
  
  // Simple distance calculation (can be improved with more accurate formula)
  const distance = Math.sqrt(
    Math.pow(lat - center.lat, 2) + Math.pow(lng - center.lng, 2)
  ) * 69; // Convert to miles (rough approximation)
  
  return distance <= radius;
};

// Method to get nearby neighborhoods
neighborhoodSchema.statics.findNearby = function(lat, lng, maxDistance = 10) {
  return this.find({
    'boundaries.center': {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [lng, lat]
        },
        $maxDistance: maxDistance * 1609.34 // Convert miles to meters
      }
    }
  });
};

// Virtual for full address
neighborhoodSchema.virtual('fullAddress').get(function() {
  return `${this.city}, ${this.state} ${this.zipCode}`;
});

// Pre-save middleware to update stats
neighborhoodSchema.pre('save', function(next) {
  // This would be updated by aggregation queries in practice
  next();
});

module.exports = mongoose.model('Neighborhood', neighborhoodSchema); 