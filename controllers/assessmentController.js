const Question = require('../models/Question');
const Answer = require('../models/Answer');
const { validationResult } = require('express-validator');

// Get Assessment Questions
exports.getQuestions = async (req, res) => {
  try {
    const questions = await Question.find();
    if (!questions.length) {
      return res.status(404).json({ msg: "No questions found" });
    }
    res.json({ questions });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server error while fetching questions" });
  }
};

// Submit Assessment Answers
exports.submitAnswers = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { answers } = req.body;

  try {
    const sleep_score = calculateSleepScore(answers); // Implement a scoring function
    const newAnswer = new Answer({
      user_id: req.user.id,
      answers,
      sleep_score,
    });

    await newAnswer.save();

    res.json({
      message: "Assessment submitted successfully",
      score: sleep_score,
      userId: req.user.id,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server error while submitting answers" });
  }
};

// Seed Questions
exports.seedQuestions = async (req, res) => {
  const questions = req.body;

  try {
    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ msg: "Invalid data: Expected an array of questions" });
    }

    await Question.insertMany(questions);
    res.json({ msg: "Questions seeded successfully", count: questions.length });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server error while seeding questions" });
  }
};

// Get Answers for Authenticated User
exports.getAnswers = async (req, res) => {
  try {
    const answers = await Answer.find({ user_id: req.user.id });
    if (!answers.length) {
      return res.status(404).json({ msg: "No answers found for this user" });
    }
    res.json({ answers });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Calculate Sleep Score
function calculateSleepScore(answers) {
  let score = 0;

  answers.forEach((answer) => {
    switch (answer.questionId) {
      case "66e93e2feb516a8b2a7d9a60":
        switch (answer.answer) {
          case "More than 7 hours":
            score += 50;
            break;
          case "5-7 hours":
            score += 30;
            break;
          case "Less than 5 hours":
            score += 10;
            break;
          default:
            break;
        }
        break;

      case "66e93e2feb516a8b2a7d9a61":
        score += parseInt(answer.answer, 10) || 0;
        break;

      case "66e93e2feb516a8b2a7d9a62":
        switch (answer.answer) {
          case "Often":
            score -= 10;
            break;
          case "Sometimes":
            score -= 5;
            break;
          case "Never":
            score += 10;
            break;
          default:
            break;
        }
        break;

      case "66e93e2feb516a8b2a7d9a63":
        switch (answer.answer) {
          case "3 or more times":
            score -= 15;
            break;
          case "1-2 times":
            score -= 5;
            break;
          case "None":
            score += 15;
            break;
          default:
            break;
        }
        break;

      default:
        break;
    }
  });

  return score;
}
