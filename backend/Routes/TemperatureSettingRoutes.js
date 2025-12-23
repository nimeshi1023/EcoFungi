const express = require('express');
const router = express.Router();
const { 
  getTemperatureSettings, 
  updateTemperatureSettings, 
  deleteTemperatureSettings 
} = require('../Controllers/TemperatureSettingController');

// GET /api/temperatureSetting - Get current temperature settings
router.get('/', getTemperatureSettings);

// POST /api/temperatureSetting - Create or update temperature settings
router.post('/', updateTemperatureSettings);

// PUT /api/temperatureSetting - Update temperature settings
router.put('/', updateTemperatureSettings);

// DELETE /api/temperatureSetting - Delete temperature settings
router.delete('/', deleteTemperatureSettings);

module.exports = router;
