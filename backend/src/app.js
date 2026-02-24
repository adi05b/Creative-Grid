const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
require('dotenv').config();

const cors = require('cors');

// In your app.js or server.js before your routes
// app.use(cors({
//   origin: true,
//   credentials: true
// }));

// app.use((req, res, next) => {
//   console.log(`${req.method} ${req.path}`);
//   next();
// });

// Import routes
const artistRoutes = require('./routes/artistRoutes');
const authRoutes = require('./routes/authRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');

const app = express();

// Middleware
app.use(logger('dev'));
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// API Routes
app.use('/api/artists', artistRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/favorites', favoriteRoutes);
// In your backend/src/app.js
app.use('/api/favorites', require('./routes/favoriteRoutes'));

// Serve static files from frontend build
// if (process.env.NODE_ENV === 'production') {
//   //app.use(express.static(path.join(__dirname, '../../frontend/build')));
  
//   // Catch-all route to serve the frontend
//   app.get('*', (req, res) => {
//     // res.sendFile(path.join(__dirname, '../../frontend/build/index.html'));
//     res.status(200).json({ message: 'Server Running!' });
//   });
// }

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong on the server' });
});

module.exports = app;