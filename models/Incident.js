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
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String
    },
    coordinates: {
      lat: {
        type: Number,
        required: true
      },
      lng: {
        type: Number,
        required: true
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
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    verifiedAt: Date,
    verifiedSource: {
      type: String,
      enum: ['police', 'fire-department', 'community-moderator', 'multiple-reports']
    }
  },
  media: {
    images: [{
      url: String,
      caption: String,
      uploadedAt: { type: Date, default: Date.now }
    }],
    videos: [{
      url: String,
      caption: String,
      uploadedAt: { type: Date, default: Date.now }
    }]
  },
  status: {
    type: String,
    enum: ['active', 'resolved', 'false-alarm', 'expired'],
    default: 'active'
  },
  resolvedAt: Date,
  resolvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  resolutionNotes: String,
  tags: [String],
  community: {
    upvotes: [{
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      timestamp: { type: Date, default: Date.now }
    }],
    downvotes: [{
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      timestamp: { type: Date, default: Date.now }
    }],
    comments: [{
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      text: String,
      isAnonymous: { type: Boolean, default: false },
      timestamp: { type: Date, default: Date.now }
    }],
    relatedIncidents: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Incident'
    }]
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
    deviceInfo: {
      type: String,
      platform: String,
      version: String
    }
  }
}, {
  timestamps: true
});

// Indexes for efficient querying
incidentSchema.index({ 'location.coordinates': '2dsphere' });
incidentSchema.index({ type: 1, createdAt: -1 });
incidentSchema.index({ severity: 1, createdAt: -1 });
incidentSchema.index({ 'verification.status': 1, createdAt: -1 });
incidentSchema.index({ status: 1, createdAt: -1 });

// Virtual for vote count
incidentSchema.virtual('voteCount').get(function() {
  return this.community.upvotes.length - this.community.downvotes.length;
});

// Virtual for comment count
incidentSchema.virtual('commentCount').get(function() {
  return this.community.comments.length;
});

// Method to check if user has voted
incidentSchema.methods.hasUserVoted = function(userId) {
  const upvoted = this.community.upvotes.some(vote => vote.user.toString() === userId.toString());
  const downvoted = this.community.downvotes.some(vote => vote.user.toString() === userId.toString());
  return { upvoted, downvoted };
};

// Method to add vote
incidentSchema.methods.addVote = function(userId, voteType) {
  const voteData = { user: userId, timestamp: new Date() };
  
  if (voteType === 'upvote') {
    // Remove from downvotes if exists
    this.community.downvotes = this.community.downvotes.filter(
      vote => vote.user.toString() !== userId.toString()
    );
    // Add to upvotes if not already there
    if (!this.community.upvotes.some(vote => vote.user.toString() === userId.toString())) {
      this.community.upvotes.push(voteData);
    }
  } else if (voteType === 'downvote') {
    // Remove from upvotes if exists
    this.community.upvotes = this.community.upvotes.filter(
      vote => vote.user.toString() !== userId.toString()
    );
    // Add to downvotes if not already there
    if (!this.community.downvotes.some(vote => vote.user.toString() === userId.toString())) {
      this.community.downvotes.push(voteData);
    }
  }
};

// Pre-save middleware to update status based on verification
incidentSchema.pre('save', function(next) {
  if (this.verification.status === 'verified' && this.status === 'active') {
    this.status = 'active';
  } else if (this.verification.status === 'false-alarm') {
    this.status = 'false-alarm';
  }
  next();
});

module.exports = mongoose.model('Incident', incidentSchema); 