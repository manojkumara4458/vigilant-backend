const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  neighborhood: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Neighborhood'
  },
  role: {
    type: String,
    enum: ['resident', 'moderator', 'admin', 'first-responder'],
    default: 'resident'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  notificationPreferences: {
    email: {
      enabled: { type: Boolean, default: true },
      types: [{
        type: String,
        enum: ['incidents', 'alerts', 'updates', 'community']
      }]
    },
    push: {
      enabled: { type: Boolean, default: true },
      types: [{
        type: String,
        enum: ['incidents', 'alerts', 'updates', 'community']
      }]
    },
    sms: {
      enabled: { type: Boolean, default: false },
      types: [{
        type: String,
        enum: ['emergency', 'critical']
      }]
    },
    radius: {
      type: Number,
      default: 5, // miles
      min: 1,
      max: 50
    }
  },
  profile: {
    avatar: String,
    bio: String,
    emergencyContacts: [{
      name: String,
      phone: String,
      relationship: String
    }]
  },
  stats: {
    reportsSubmitted: { type: Number, default: 0 },
    reportsVerified: { type: Number, default: 0 },
    communityScore: { type: Number, default: 0 }
  },
  lastActive: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Get full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Hide password in JSON
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  return user;
};

module.exports = mongoose.model('User', userSchema); 