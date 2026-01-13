const mongoose = require("mongoose");

const AqiTrafficSchema = new mongoose.Schema(
  {
    location: {
      name: { type: String, required: true },
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true }
    },

    weather: {
      temperature_max: Number,
      humidity: Number,
      air_pressure: Number
    },

    pollution_display: {
      pm2_5: Number,
      pm10: Number,
      co: Number,
      no2: Number,
      so2: Number,
      ozone: Number
    },

    pollution_model_input: {
      pm2_5: Number,
      pm10: Number,
      co: Number,
      no2: Number,
      so2: Number,
      ozone: Number
    },

    predictions: {
      aqi: { type: Number, required: true },
      traffic_density: { type: String, required: true }
    }
  },
  {
    timestamps: true // createdAt, updatedAt
  }
);

module.exports = mongoose.model("AqiTraffic", AqiTrafficSchema);
