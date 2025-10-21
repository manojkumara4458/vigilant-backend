const mongoose = require('mongoose');

const neighborhoodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  boundaries: {
    center: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number], // [lng, lat]
        required: true
      }
    },
    radius: {
      type: Number,
      default: 2.5 // kilometers or miles depending on your logic
    },
    polygon: {
      type: Array,
      default: []
    }
  },
  city: String,
  state: String,
  zipCode: String,
  country: String,
  moderators: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  admins: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  stats: {
    totalResidents: Number,
    activeResidents: Number,
    totalIncidents: Number,
    incidentsThisMonth: Number,
    averageResponseTime: Number,
    safetyScore: Number
  },
  settings: {
    isPublic: Boolean,
    requireApproval: Boolean,
    allowAnonymousReports: Boolean,
    autoVerifyThreshold: Number
  }
}, { timestamps: true });

neighborhoodSchema.index({ 'boundaries.center': '2dsphere' });

module.exports = mongoose.model('Neighborhood', neighborhoodSchema);
