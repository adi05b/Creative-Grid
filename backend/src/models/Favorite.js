// backend/src/models/Favorite.js
const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  artistId: {
    type: String,
    required: true
  },
  artistData: {
    name: String,
    image: String,
    nationality: String,
    birthday: String,
    deathday: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create a compound index to ensure a user can't favorite the same artist twice
favoriteSchema.index({ userId: 1, artistId: 1 }, { unique: true });

module.exports = mongoose.model('Favorite', favoriteSchema);