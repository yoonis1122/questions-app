const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  playerName: {
    type: String,
    required: true,
  },
  playerImage: {
    type: String,
  },
  section: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  }
}, { timestamps: true });

module.exports = mongoose.model('Result', resultSchema);
