const express = require("express");
const router = express.Router();
const Incident = require("../models/incident");
const User = require("../models/user"); // if you reference reporter
const auth = require("../middleware/auth"); // if you use JWT auth

// 🚨 Create a new incident
router.post("/", auth, async (req, res) => {
  try {
    const {
      title,
      description,
      type,
      severity,
      location,
      reporter,
      isAnonymous,
      media,
    } = req.body;

    if (!location || !location.coordinates) {
      return res.status(400).json({
        error: "Location coordinates [lng, lat] are required.",
      });
    }

    const incident = new Incident({
      title,
      description,
      type,
      severity,
      location, // { type: "Point", coordinates: [lng, lat] }
      reporter,
      isAnonymous,
      media,
    });

    await incident.save();

    res.status(201).json({
      success: true,
      message: "Incident created successfully",
      incident,
    });
  } catch (err) {
    console.error("Create incident error:", err);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

// 📋 Get all incidents
router.get("/", async (req, res) => {
  try {
    const incidents = await Incident.find()
      .populate("reporter", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: incidents.length,
      incidents,
    });
  } catch (err) {
    console.error("Get incidents error:", err);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

// 🗺️ Get incidents near a location
router.get("/nearby", async (req, res) => {
  try {
    const { lng, lat, radius = 5000 } = req.query;

    if (!lng || !lat) {
      return res
        .status(400)
        .json({ error: "Longitude and latitude are required." });
    }

    const incidents = await Incident.find({
      location: {
        $near: {
          $geometry: { type: "Point", coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: parseFloat(radius),
        },
      },
    });

    res.json({ success: true, count: incidents.length, incidents });
  } catch (err) {
    console.error("Nearby incidents error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ✅ Update an incident’s status (resolve, verify, etc.)
router.put("/:id/status", auth, async (req, res) => {
  try {
    const { status, resolutionNotes } = req.body;
    const incident = await Incident.findByIdAndUpdate(
      req.params.id,
      { status, resolutionNotes, resolvedAt: new Date() },
      { new: true }
    );

    if (!incident) return res.status(404).json({ error: "Incident not found" });

    res.json({ success: true, incident });
  } catch (err) {
    console.error("Update incident error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 🗑️ Delete an incident
router.delete("/:id", auth, async (req, res) => {
  try {
    const incident = await Incident.findByIdAndDelete(req.params.id);
    if (!incident) return res.status(404).json({ error: "Incident not found" });

    res.json({ success: true, message: "Incident deleted successfully" });
  } catch (err) {
    console.error("Delete incident error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
