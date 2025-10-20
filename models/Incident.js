const mongoose = require('mongoose');

const incidentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000
  },
  type: {
    type: String,
    required: true,
    enum: [
      'theft', 'vandalism', 'assault', 'suspicious-activity', 'fire', 
      'accident', 'medical-emergency', 'road-hazard', 'broken-infrastructure',
      'noise-disturbance', 'traffic-violation', 'other'
    ]
  },
  severity: {
    type: String,
    required: true,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
      default: 'Point'
    },
    coordinates: {
      type: [Number], // ✅ Must be [lng, lat]
      required: true,
      validate: {
        validator: function(v) {
          return (
            Array.isArray(v) &&
            v.length === 2 &&
            typeof v[0] === 'number' &&
            typeof v[1] === 'number' &&
            v[0] >= -180 && v[0] <= 180 && // longitude
            v[1] >= -90 && v[1] <= 90 // latitude
          );
        },
        message: props => `${props.value} is not a valid [longitude, latitude] coordinate!`
      }
    },
    neighborhood: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Neighborhood'
    }
  },
  reporter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isAnonymous: {
    type: Boolean,
    default: false
  },
  verification: {
    status: {
      type: String,
      enum: ['pending', 'verified', 'false-alarm', 'resolved'],
      default: 'pending'
    },
    verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    verifiedAt: Date,
    verifiedSource: {
      type: String,
      enum: ['police', 'fire-department', 'community-moderator', 'multiple-reports']
    }
  },
  media: {
    images: [{ url: String, caption: String, uploadedAt: { type: Date, default: Date.now } }],
    videos: [{ url: String, caption: String, uploadedAt: { type: Date, default: Date.now } }]
  },
  status: {
    type: String,
    enum: ['active', 'resolved', 'false-alarm', 'expired'],
    default: 'active'
  },
  resolvedAt: Date,
  resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  resolutionNotes: String,
  tags: [String],
  community: {
    upvotes: [{ user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, timestamp: { type: Date, default: Date.now } }],
    downvotes: [{ user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, timestamp: { type: Date, default: Date.now } }],
    comments: [{ user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, text: String, isAnonymous: { type: Boolean, default: false }, timestamp: { type: Date, default: Date.now } }],
    relatedIncidents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Incident' }]
  },
  alerts: {
    pushSent: { type: Boolean, default: false },
    emailSent: { type: Boolean, default: false },
    smsSent: { type: Boolean, default: false },
    sentAt: Date
  },
  metadata: {
    ipAddress: String,
    userAgent: String,
    deviceInfo: { type: String, platform: String, version: String }
  }
}, { timestamps: true });

// Geospatial index
incidentSchema.index({ location: '2dsphere' });

// Virtuals
incidentSchema.virtual('voteCount').get(function() {
  return this.community.upvotes.length - this.community.downvotes.length;
});
incidentSchema.virtual('commentCount').get(function() {
  return this.community.comments.length;
});

module.exports = mongoose.model('Incident', incidentSchema);
