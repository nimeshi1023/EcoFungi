const TemperatureSetting = require('../Model/TemperatureSetting');
const axios = require('axios');
const { fetchBlynkData } = require('./IoTController');

// Get current temperature settings
const getTemperatureSettings = async (req, res) => {
  try {
    const settings = await TemperatureSetting.findOne().sort({ updatedAt: -1 });
    if (!settings) {
      // Create default settings if none exist
      const defaultSettings = new TemperatureSetting({
        maxTemp: 30,
        autoMode: false
      });
      await defaultSettings.save();
      return res.json({ data: defaultSettings });
    }
    res.json({ data: settings });
  } catch (error) {
    console.error('Error getting temperature settings:', error);
    res.status(500).json({ error: 'Failed to get temperature settings' });
  }
};

// Auto control relay based on live temperature vs saved max
const autoControlRelayIfNeeded = async () => {
  try {
    const settings = await TemperatureSetting.findOne();
    if (!settings || !settings.autoMode) {
      return { skipped: true, reason: 'Auto mode disabled or settings missing' };
    }

    const live = await fetchBlynkData();
    const currentTemp = live && typeof live.temperature === 'number' ? live.temperature : null;
    if (currentTemp === null) {
      return { skipped: true, reason: 'Live temperature not available' };
    }

    if (currentTemp >= settings.maxTemp) {
      const token = "5zV5DqmmwIKanPx7JJeg-fqVeOG8oB5n";

      if (!token) {
        console.warn('BLYNK_TOKEN env var not set; cannot control relay');
        return { triggered: false, reason: 'Missing BLYNK_TOKEN' };
      }
      // Active-low relay: ON => V1=0
      await axios.get(`https://blynk.cloud/external/api/update?token=${token}&V1=0`);
      return { triggered: true, temperature: currentTemp, threshold: settings.maxTemp };
    }

    return { triggered: false, temperature: currentTemp, threshold: settings.maxTemp };
  } catch (error) {
    console.error('Auto control relay failed:', error);
    return { error: 'Auto control relay failed' };
  }
};

// Create or update temperature settings
const updateTemperatureSettings = async (req, res) => {
  try {
    const { maxTemp, autoMode } = req.body;
    
    if (typeof maxTemp !== 'number' || maxTemp <= 0) {
      return res.status(400).json({ error: 'Invalid maxTemp value' });
    }

    // Find existing settings or create new ones
    let settings = await TemperatureSetting.findOne();
    
    if (settings) {
      // Update existing
      settings.maxTemp = maxTemp;
      settings.autoMode = autoMode !== undefined ? autoMode : settings.autoMode;
      settings.updatedAt = new Date();
      await settings.save();
    } else {
      // Create new
      settings = new TemperatureSetting({
        maxTemp,
        autoMode: autoMode !== undefined ? autoMode : false
      });
      await settings.save();
    }

    // Try to auto-control relay after updating settings
    const autoResult = await autoControlRelayIfNeeded();

    res.json({ 
      message: 'Temperature settings updated successfully',
      data: settings,
      autoResult
    });
  } catch (error) {
    console.error('Error updating temperature settings:', error);
    res.status(500).json({ error: 'Failed to update temperature settings' });
  }
};

// Delete temperature settings
const deleteTemperatureSettings = async (req, res) => {
  try {
    await TemperatureSetting.deleteMany({});
    res.json({ message: 'Temperature settings deleted successfully' });
  } catch (error) {
    console.error('Error deleting temperature settings:', error);
    res.status(500).json({ error: 'Failed to delete temperature settings' });
  }
};

module.exports = {
  getTemperatureSettings,
  updateTemperatureSettings,
  deleteTemperatureSettings,
  autoControlRelayIfNeeded
};
