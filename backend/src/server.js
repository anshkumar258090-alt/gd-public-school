require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');

const app = express();

// Connect Database
connectDB();

// Middleware
app.use(morgan('dev'));
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// CORS
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, or same-origin)
    // and allow all localhost and Vercel domains
    callback(null, true);
  },
  credentials: true,
}));

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'GD Public School API is running 🏫', status: 'ok' });
});

const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/school', require('./routes/school'));
app.use('/api/team', require('./routes/team'));
app.use('/api/media', require('./routes/media'));
app.use('/api/notices', require('./routes/notices'));
app.use('/api/stats', require('./routes/stats'));
app.use('/api/enquiries', require('./routes/enquiries'));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
