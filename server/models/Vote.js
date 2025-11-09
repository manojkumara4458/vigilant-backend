// server/models/Vote.js
const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
  incidentId: {                       // link to incident
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Incident',
    required: true
  },
  userId: {                           // who voted
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  vote: {                             // true = real, false = fake
    type: Boolean,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Vote', voteSchema);
