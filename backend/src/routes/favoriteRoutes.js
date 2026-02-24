// backend/src/routes/favoriteRoutes.js
const express = require('express');
const favoriteController = require('../controllers/favoriteController');
// const { authenticated } = require('../middleware/auth');
const router = express.Router();

// Apply authentication middleware to all routes
// router.use(authenticated);

// Get all favorites
router.get('/:userId', favoriteController.getFavorites);

// Add to favorites
router.post('/', favoriteController.addFavorite);

// Remove from favorites
router.delete('/:artistId', favoriteController.removeFavorite);

// Check if an artist is a favorite
router.get('/check/:artistId', favoriteController.checkFavorite);

module.exports = router;
