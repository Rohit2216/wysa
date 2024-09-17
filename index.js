const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const assessmentRoutes = require('./routes/assessment');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
connectDB();

app.use(bodyParser.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/assessment', assessmentRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
