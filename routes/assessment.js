const express = require('express');
const { check } = require('express-validator');
const auth = require('../middlewares/authMiddleware');
const {
  getQuestions,
  submitAnswers,
  seedQuestions,
  getAnswers
} = require('../controllers/assessmentController');

const assessmentRoutes = express.Router();

// Validation middleware for answers
const validateAnswers = [
  check("answers")
    .isArray()
    .withMessage("Answers should be an array")
    .notEmpty()
    .withMessage("Answers cannot be empty")
    .bail()
    .custom((answers) => {
      return answers.every(
        (answer) =>
          typeof answer.questionId === "string" &&
          answer.questionId.length > 0 &&
          (typeof answer.answer === "string" || typeof answer.answer === "number")
      );
    })
    .withMessage("Each answer must have a questionId and answer"),
];

// Get Assessment Questions
assessmentRoutes.get('/questions', auth, getQuestions);

// Submit Assessment Answers
assessmentRoutes.post('/submit', auth, validateAnswers, submitAnswers);

// Seed Questions
assessmentRoutes.post('/seed', seedQuestions);

// Get Answers
assessmentRoutes.get('/answers', auth, getAnswers);

module.exports = assessmentRoutes;
