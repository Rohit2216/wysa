const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// User Signup
exports.signup = async (req, res) => {
  const { nickname, password } = req.body;

  try {
    // Check if user already exists
    let user = await User.findOne({ nickname });
    if (user) {
      return res.status(400).json({ errors: [{ msg: 'User with this nickname already exists' }] });
    }

    // Create a new user
    user = new User({ nickname, password });

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Save the user to the database
    await user.save();

    // Create and sign the JWT token
    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Return success response with token and user id
    res.status(201).json({
      message: 'User registered successfully',
      token,
      userId: user.id
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ errors: [{ msg: 'Server error during user registration' }] });
  }
};

// User Login
exports.login = async (req, res) => {
  const { nickname, password } = req.body;

  try {
    // Find the user by nickname
    const user = await User.findOne({ nickname });
    if (!user) {
      return res.status(400).json({ errors: [{ msg: 'Invalid nickname or password' }] });
    }

    // Compare the provided password with the stored hash
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ errors: [{ msg: 'Invalid nickname or password' }] });
    }

    // Create and sign the JWT token
    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Return success response with token and user id
    res.json({
      message: 'Login successful',
      token,
      userId: user.id
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ errors: [{ msg: 'Server error during user login' }] });
  }
};
