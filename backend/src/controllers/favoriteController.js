// backend/src/controllers/favoriteController.js
const Favorite = require('../models/Favorite');

// Get all favorites for the logged-in user
exports.getFavorites = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const favorites = await Favorite.find({ userId: userId })
      .sort({ createdAt: -1 }); // Newest first
    
    res.status(200).json(favorites);
  } catch (error) {
    next(error);
  }
};

// Add an artist to favorites
exports.addFavorite = async (req, res, next) => {
  try {
    const { artistId, artistData } = req.body;
    
    // Check if already in favorites
    const existingFavorite = await Favorite.findOne({
      userId: req.userId,
      artistId
    });
    
    if (existingFavorite) {
      return res.status(400).json({
        error: 'Artist already in favorites'
      });
    }
    
    // Create new favorite
    const favorite = new Favorite({
      userId: req.userId,
      artistId,
      artistData,
      createdAt: new Date()
    });
    
    await favorite.save();
    
    res.status(201).json(favorite);
  } catch (error) {
    next(error);
  }
};

// Remove an artist from favorites
exports.removeFavorite = async (req, res, next) => {
  try {
    const { artistId } = req.params;
    
    const result = await Favorite.findOneAndDelete({
      userId: req.userId,
      artistId
    });
    
    if (!result) {
      return res.status(404).json({
        error: 'Favorite not found'
      });
    }
    
    res.status(200).json({
      message: 'Removed from favorites'
    });
  } catch (error) {
    next(error);
  }
};

// Check if an artist is in favorites
exports.checkFavorite = async (req, res) => {
  try {
    const { artistId } = req.params;
    const userId = req.userId;

    const favorite = await Favorite.findOne({ userId, artistId });
    res.status(200).json({ isFavorite: !!favorite });
  } catch (error) {
    res.status(500).json({ message: 'Error checking favorite', error: error.message });
  }
};