const express = require('express');
const router = express.Router();
const { 
  fetchBlynkData, 
  controlRelay, 
  saveDailyStats, 
  getHistory, 
  getLatest, 
  recordReadingAndUpdateDailyStats, 
  getStats,
  autoRelayControl,
   getRelayStatus,
    controlbuzzer
} = require('../Controllers/IoTController');

const TemperatureSetting = require("../Model/TemperatureSetting"); // ✅ model import

// Real-time data + auto relay control
router.get('/live', async (req, res) => {
  const data = await autoRelayControl(); // Updated to include auto relay logic
  res.json(data);
});

// Frontend expects
router.get('/getLatest', async (req, res) => {
  const data = await getLatest();
  res.json(data);
});

// Alias for tests
router.get('/latest', async (req, res) => {
  const data = await getLatest();
  res.json(data);
});

// Relay STATUS
router.get('/status', async (req, res) => {
  const result = await getRelayStatus();
  res.json(result);
});

//relay on off
router.get('/sprayOn', async (req, res) => {
  const result = await controlRelay(true);
  res.json(result);
});

router.get('/sprayOff', async (req, res) => {
  const result = await controlRelay(false);
  res.json(result);
});


//buzzer on off
router.get('/buzzerOn', async (req, res) => {
  const result = await controlbuzzer(true);
  res.json(result);
});

router.get('/buzzerOff', async (req, res) => {
  const result = await controlbuzzer(false);
  res.json(result);
});

// Save daily min/max (trigger once per day)
router.post('/saveDailyStats', async (req, res) => {
  const readings = req.body.readings; // array of today's readings from frontend
  const record = await saveDailyStats(readings);
  res.json({ data: record });
});

// Get last 5 days history
router.get('/history', async (req, res) => {
  const data = await getHistory();
  res.json({ data });
});

// Store single reading and update today's min/max
router.post('/store', async (req, res) => {
  try {
    const { temperature, humidity, timestamp } = req.body || {};
    if (typeof temperature !== 'number' || typeof humidity !== 'number') {
      return res.status(400).json({ error: 'Invalid payload' });
    }
    const result = await recordReadingAndUpdateDailyStats({ temperature, humidity, timestamp });
    res.json({ data: result });
  } catch (e) {
    res.status(500).json({ error: 'Failed to store reading' });
  }
});

// Combined stats payload: latest live + today min/max
router.get('/stats', async (req, res) => {
  try {
    // Upsert today's min/max using current live reading if available
    const live = await fetchBlynkData();
    if (typeof live.temperature === 'number' && typeof live.humidity === 'number') {
      try {
        await recordReadingAndUpdateDailyStats({
          temperature: live.temperature,
          humidity: live.humidity,
          timestamp: new Date().toISOString()
        });
      } catch (_) {
        // ignore upsert errors; still return stats
      }
    }

    const data = await getStats();
    res.json({ data });
  } catch (e) {
    res.status(500).json({ error: 'Failed to get stats' });
  }
});


// ==========================
// ✅ Temperature Setting POST/GET
// ==========================

// Save or update max temp + auto mode
router.post('/temperatureSetting', async (req, res) => {
  try {
    const { maxTemp, autoMode } = req.body;
    if (typeof maxTemp !== 'number') return res.status(400).json({ error: "Invalid maxTemp" });

    const updated = await TemperatureSetting.findOneAndUpdate(
      {},
      { maxTemp, autoMode, updatedAt: new Date() },
      { upsert: true, new: true }
    );
    res.json({ success: true, data: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save settings" });
  }
});

// Get latest max temp + auto mode
router.get('/temperatureSetting', async (req, res) => {
  try {
    const settings = await TemperatureSetting.findOne({});
    res.json({ data: settings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to get settings" });
  }
});


module.exports = router;
