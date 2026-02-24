// backend/src/routes/authRoutes.js
const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();

// Register a new user
router.post('/register', authController.register);

// Login a user
router.post('/login', authController.login);

// Get current user
router.get('/me', authController.getCurrentUser);

// Logout a user
router.post('/logout', authController.logout);

// Delete user account
router.delete('/delete-account', authController.deleteAccount);

module.exports = router;