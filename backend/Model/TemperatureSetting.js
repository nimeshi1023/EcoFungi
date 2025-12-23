const mongoose = require("mongoose");

const temperatureSchema = new mongoose.Schema({
  maxTemp: { type: Number, required: true },
  autoMode: { type: Boolean, default: false },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("TemperatureSetting", temperatureSchema);
