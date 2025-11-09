// server/routes/votes.js
const express = require('express');
const router = express.Router();
const Vote = require('../models/vote');
const verifyToken = require('../middleware/auth'); // adjust path if needed
const mongoose = require('mongoose');

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

    const userVoteDoc = votes.find(v => v.userId.toString() === req.user.id);
    const userVote = userVoteDoc ? (userVoteDoc.vote ? true : false) : null;

    res.json({
      incidentId,
      trueVotes,
      falseVotes,
      userVote
    });
  } catch (err) {
    console.error('Error fetching vote summary', err);
    res.status(500).json({ message: 'Failed to fetch vote summary' });
  }
});

// POST /api/votes/:incidentId/vote
// body: { vote: true/false } — this will create or update the user's vote
router.post('/:incidentId/vote', verifyToken, async (req, res) => {
  try {
    const { incidentId } = req.params;
    const { vote } = req.body;
    const userId = req.user.id;

    if (typeof vote !== 'boolean') {
      return res.status(400).json({ message: 'vote must be boolean' });
    }

    // Upsert: if user already voted for this incident, update; otherwise create
    let doc = await Vote.findOne({ incidentId, userId });

    if (doc) {
      doc.vote = vote;
      await doc.save();
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
