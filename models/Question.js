const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  type: { type: String, required: true }, // e.g., "single_choice", "rating"
  choices: [String], // For "single_choice"
  scale: [Number] // For "rating"
});

module.exports = mongoose.model('Question', QuestionSchema);
