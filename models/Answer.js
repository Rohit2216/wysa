const mongoose = require('mongoose');

const AnswerSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  answers: [
    {
      question_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
      answer: { type: String || Number, required: true }
    }
  ],
  sleep_score: Number,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Answer', AnswerSchema);
