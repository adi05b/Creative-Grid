const express = require('express');
const router = express.Router();
const { 
  searchArtists, 
  getArtistDetails, 
  getArtistArtworks,
  getArtworkCategories,
  getSimilarArtists
} = require('../controllers/artistController');

// Search for artists
router.get('/search', searchArtists);

// Get artist details
router.get('/details/:id', getArtistDetails);

// Get artist artworks
router.get('/artworks/:id', getArtistArtworks);

// Get artwork categories
router.get('/categories/:artworkId', getArtworkCategories);

// Get similar artists (protected route for authenticated users only)
router.get('/similar/:artistId', getSimilarArtists);

module.exports = router;