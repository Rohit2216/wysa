
const express = require('express');
const { signup, login } = require('../controllers/authController');
const router = express.Router();

// User Signup Route
router.post('/signup', signup);

// User Login Route
router.post('/login', login);

module.exports = router;
