const axios = require('axios');
const IotData = require('../Model/IoTData');
const maxtempm = require('../Model/TemperatureSetting');
const BLYNK_TOKEN = "5zV5DqmmwIKanPx7JJeg-fqVeOG8oB5n";  //D3EePqet-8MAOHDTrRpSPPg_ADFHOYag

// Fetch real-time Blynk data
const fetchBlynkData = async () => {
  try {
    // Fetch temperature and humidity data from Blynk Cloud
    const tempRes = await axios.get(`https://blynk.cloud/external/api/get?token=${BLYNK_TOKEN}&V0`);
    const humRes = await axios.get(`https://blynk.cloud/external/api/get?token=${BLYNK_TOKEN}&V3`);
    
    const t = parseFloat(tempRes.data);
    const h = parseFloat(humRes.data);

    // If data is invalid, mark as offline
    if (!Number.isFinite(t) || !Number.isFinite(h)) {
      return { temperature: null, humidity: null, offline: true };
    }

    return {
      temperature: t,
      humidity: h,
      offline: false
    };
  } catch (err) {
    console.error('Error fetching Blynk data:', err);
    return { temperature: null, humidity: null, offline: true }; // If request fails, mark as offline
  }
};

// Relay control (active-low: 0 = ON, 1 = OFF)
const controlRelay = async (status) => {
  try {
    const value = status ? 0 : 1; // active-low mapping
    await axios.get(`https://blynk.cloud/external/api/update?token=${BLYNK_TOKEN}&V1=${value}`);
    return { message: status ? 'Spray ON' : 'Spray OFF', value };
  } catch (err) {
    console.error('Relay control failed:', err);
    return { error: 'Relay control failed' };
  }
};

// Buzzer control (active-low: 1 = ON, 0 = OFF)
const controlbuzzer = async (status) => {
  try {
    const value = status ? 1 : 0; // active-low mapping
    await axios.get(`https://blynk.cloud/external/api/update?token=${BLYNK_TOKEN}&V2=${value}`);
    return { message: status ? 'buzzer ON' : 'buzzer OFF', value };
  } catch (err) {
    console.error('Buzzer control failed:', err);
    return { error: 'Buzzer control failed' };
  }
};

// Relay status read (from Blynk)
const getRelayStatus = async () => {
  try {
    const response = await axios.get(`https://blynk.cloud/external/api/get?token=${BLYNK_TOKEN}&V1`);
    const value = parseInt(response.data); // 0 = ON, 1 = OFF (active-low)
    const status = value === 0 ? 'ON' : 'OFF';
    return { message: `Spray ${status}`, value };
  } catch (err) {
    console.error('Status fetch failed:', err);
    return { error: 'Status fetch failed' };
  }
};

// Auto relay control based on maxTemp in DB
const autoRelayControl = async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayRecord = await maxtempm.findOne({ date: today });

    if (!todayRecord || todayRecord.maxTemp == null) return null;

    const liveData = await fetchBlynkData();
    if (liveData.temperature == null) return null;

    // Temp > maxTemp → ON, else OFF
    const status = liveData.temperature > todayRecord.maxTemp;
    await controlRelay(status);

    return {
      temperature: liveData.temperature,
      maxTemp: todayRecord.maxTemp,
      relayStatus: status ? 'ON' : 'OFF'
    };
  } catch (err) {
    console.error("Auto relay control error:", err);
    return { error: "Failed auto relay control" };
  }
};

// Save daily min/max stats to database
const saveDailyStats = async (readings) => {
  if (!readings || !readings.length) return null;

  const temps = readings.map(r => r.temperature);
  const hums = readings.map(r => r.humidity);

  const minTemp = Math.min(...temps);
  const maxTemp = Math.max(...temps);
  const minHumidity = Math.min(...hums);
  const maxHumidity = Math.max(...hums);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const record = await IotData.findOneAndUpdate(
    { date: today },
    { minTemp, maxTemp, minHumidity, maxHumidity },
    { upsert: true, new: true }
  );
  return record;
};

// Get 5-day history
const getHistory = async () => {
  const fiveDaysAgo = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000);
  const data = await IotData.find({ date: { $gte: fiveDaysAgo } }).sort({ date: 1 });
  return data;
};

// Record a single reading and update today's min/max
const recordReadingAndUpdateDailyStats = async (reading) => {
  if (!reading) return null;
  const { temperature, humidity, timestamp } = reading;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const existing = await IotData.findOne({ date: today });

  const nextMinTemp = existing ? Math.min(existing.minTemp, temperature) : temperature;
  const nextMaxTemp = existing ? Math.max(existing.maxTemp, temperature) : temperature;
  const nextMinHumidity = existing ? Math.min(existing.minHumidity, humidity) : humidity;
  const nextMaxHumidity = existing ? Math.max(existing.maxHumidity, humidity) : humidity;

  const updated = await IotData.findOneAndUpdate(
    { date: today },
    {
      minTemp: nextMinTemp,
      maxTemp: nextMaxTemp,
      minHumidity: nextMinHumidity,
      maxHumidity: nextMaxHumidity
    },
    { upsert: true, new: true }
  );

  return { updated, timestamp: timestamp || new Date().toISOString() };
};

// Get the latest reading with timestamp
const getLatest = async () => {
  const live = await fetchBlynkData();

  return { 
    ...live, 
    timestamp: new Date().toISOString()
  };
};

// Combined stats payload for frontend
const getStats = async () => {
  const latest = await getLatest();

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayRecord = await IotData.findOne({ date: today });

  return {
    temperature: latest.temperature,
    humidity: latest.humidity,
    minTemp: todayRecord ? todayRecord.minTemp : null,
    maxTemp: todayRecord ? todayRecord.maxTemp : null,
    minHumidity: todayRecord ? todayRecord.minHumidity : null,
    maxHumidity: todayRecord ? todayRecord.maxHumidity : null,
    timestamp: latest.timestamp,
    offline: latest.offline  // Ensure this is being passed to frontend
  };
};

// Get device status
const getDeviceStatus = async () => {
  try {
    const liveData = await fetchBlynkData();
    return { offline: liveData.offline, message: liveData.offline ? 'Device is offline' : 'Device is online' };
  } catch (err) {
    console.error('Error fetching device status:', err);
    return { offline: true, message: 'Device is offline' };
  }
};

module.exports = {
  fetchBlynkData,
  controlRelay,
  autoRelayControl,      
  saveDailyStats,
  getHistory,
  getLatest,
  recordReadingAndUpdateDailyStats,
  getStats,
  getRelayStatus,
  controlbuzzer,
  getDeviceStatus
};
