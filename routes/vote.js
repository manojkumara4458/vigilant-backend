// server/routes/vote.js
const express = require('express');
const router = express.Router();
const Vote = require('../models/vote'); // make sure file is named vote.js in models
const { auth: verifyToken } = require('../middleware/auth'); // JWT auth
const mongoose = require('mongoose');

// ------------------ GET vote summary ------------------
// GET /api/votes/:incidentId/summary
// returns counts and current user's vote
router.get('/:incidentId/summary', verifyToken, async (req, res) => {
  try {
    const { incidentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(incidentId)) {
      return res.status(400).json({ message: 'Invalid incidentId' });
    }

    const votes = await Vote.find({ incidentId });

    const trueVotes = votes.filter(v => v.vote === true).length;
    const falseVotes = votes.filter(v => v.vote === false).length;

    const userVoteDoc = votes.find(v => v.userId.toString() === req.user._id.toString());
    const userVote = userVoteDoc ? userVoteDoc.vote : null;

    res.json({ incidentId, trueVotes, falseVotes, userVote });
  } catch (err) {
    console.error('Error fetching vote summary', err);
    res.status(500).json({ message: 'Failed to fetch vote summary' });
  }
});

// ------------------ POST vote ------------------
// POST /api/votes/:incidentId/vote
// body: { vote: true/false } — this will create or update the user's vote
router.post('/:incidentId/vote', verifyToken, async (req, res) => {
  try {
    const { incidentId } = req.params;
    const { vote } = req.body;
    const userId = req.user._id;

    if (typeof vote !== 'boolean') {
      return res.status(400).json({ message: 'Vote must be boolean' });
    }

    // Upsert vote
    const existingVote = await Vote.findOne({ incidentId, userId });

    if (existingVote) {
      existingVote.vote = vote;
      await existingVote.save();
      return res.json({ message: 'Vote updated' });
    }

    const newVote = new Vote({ incidentId, userId, vote });
    await newVote.save();

    return res.json({ message: 'Vote recorded' });
  } catch (err) {
    console.error('Error casting vote', err);
    res.status(500).json({ message: 'Failed to cast vote' });
  }
});

module.exports = router;
