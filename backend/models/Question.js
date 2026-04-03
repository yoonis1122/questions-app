const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  section: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: function() { return !this.image; }
  },
  image: {
    type: String,
    required: function() { return !this.text; }
  },
  options: {
    type: [String],
    required: true,
    validate: [arrayLimit, '{PATH} must have exactly 4 items']
  },
  correctAnswer: {
    type: String,
    required: true
  }
}, { timestamps: true });

function arrayLimit(val) {
  return val.length === 4;
}

module.exports = mongoose.model('Question', questionSchema);
