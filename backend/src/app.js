const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const errorHandler = require('./middleware/errorHandler');

// Route imports
const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const trainingRoutes = require('./routes/trainingRoutes');
const jobRoutes = require('./routes/jobRoutes');
const matchingRoutes = require('./routes/matchingRoutes');
const employmentRoutes = require('./routes/employmentRoutes');
const governmentRoutes = require('./routes/governmentRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

const app = express();

// Security middleware
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:1006',
  credentials: true,
}));

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Static files (uploads)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/trainings', trainingRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/matching', matchingRoutes);
app.use('/api/employment', employmentRoutes);
app.use('/api/government', governmentRoutes);
app.use('/api/notifications', notificationRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'SkillPulse API is running.',
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found.`,
  });
});

// Error handler
app.use(errorHandler);

module.exports = app;
