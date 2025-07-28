const mongoose = require("mongoose");
// routes/sensors.js
const express = require('express');
const router = express.Router();
const Sensor = require('../models/Sensor');

// Get latest sensor reading
router.get('/latest', async (req, res) => {
  try {
    const latest = await Sensor.findOne().sort({ timestamp: -1 });
    if (!latest) return res.status(404).json({ error: 'No data found' });
    res.json(latest);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

const sensorSchema = new mongoose.Schema({
  temperature: Number,
  humidity: Number,
  light: Number,
  soilMoisture: Number,
  waterLevel: Number,
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Sensor", sensorSchema);
