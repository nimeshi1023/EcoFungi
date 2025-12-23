const mongoose = require('mongoose');

const ioTDataSchema = new mongoose.Schema({
  date: { type: Date, required: true }, // day reference
  minTemp: { type: Number, required: true },
  maxTemp: { type: Number, required: true },
  minHumidity: { type: Number, required: true },
  maxHumidity: { type: Number, required: true }
});

module.exports = mongoose.model('IoTData', ioTDataSchema);
