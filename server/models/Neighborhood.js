const mongoose = require('mongoose');

const neighborhoodSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, trim: true, maxlength: 1000, default: '' },
  
  boundaries: {
    center: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number], // [lng, lat]
        required: true,
        validate: {
          validator: function(v) {
            return Array.isArray(v) &&
                   v.length === 2 &&
                   typeof v[0] === 'number' &&
                   typeof v[1] === 'number' &&
                   v[0] >= -180 && v[0] <= 180 &&
                   v[1] >= -90 && v[1] <= 90;
          },
          message: props => `${props.value} is not a valid [lng, lat] coordinate!`
        }
      }
    },
    radius: { type: Number, default: 2.5 }, // km
    polygon: { type: Array, default: [] }
  },

  city: { type: String, default: 'Unknown City', trim: true },
  state: { type: String, default: 'Unknown State', trim: true },
  zipCode: { type: String, trim: true },
  country: { type: String, default: 'USA', trim: true },

  moderators: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  admins: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

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
    types: [{ type: String, enum: ['incidents', 'community', 'emergency', 'updates'] }],
    frequency: { type: String, enum: ['immediate', 'hourly', 'daily', 'weekly'], default: 'immediate' }
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

}, { timestamps: true });

// Indexes
neighborhoodSchema.index({ 'boundaries.center': '2dsphere' });
neighborhoodSchema.index({ city: 1, state: 1 });
neighborhoodSchema.index({ name: 'text', description: 'text' });

// Method to check if coordinates are within neighborhood
neighborhoodSchema.methods.containsLocation = function(lat, lng) {
  const { center, radius } = this.boundaries;
  const distance = Math.sqrt(
    Math.pow(lat - center.coordinates[1], 2) + Math.pow(lng - center.coordinates[0], 2)
  ) * 111; // rough km approximation
  return distance <= radius;
};

// Method to get nearby neighborhoods
neighborhoodSchema.statics.findNearby = function(lat, lng, maxDistance = 10) {
  return this.find({
    'boundaries.center': {
      $near: {
        $geometry: { type: 'Point', coordinates: [lng, lat] },
        $maxDistance: maxDistance * 1000 // km to meters
      }
    }
  });
};

// Virtual for full address
neighborhoodSchema.virtual('fullAddress').get(function() {
  return `${this.city}, ${this.state} ${this.zipCode || ''}`;
});

module.exports = mongoose.model('Neighborhood', neighborhoodSchema);
