// backend/src/services/artsyService.js
const axios = require('axios');
require('dotenv').config();

// Cache the token to avoid requesting it for every API call
let cachedToken = null;
let tokenExpiration = null;

/**
 * Get Artsy API token
 * @returns {Promise<string>} The X-XAPP-Token
 */
const getArtsyToken = async () => {
  // If token exists and is not expired, return it
  if (cachedToken && tokenExpiration && tokenExpiration > Date.now()) {
    return cachedToken;
  }

  try {
    const response = await axios.post('https://api.artsy.net/api/tokens/xapp_token', {
      client_id: process.env.ARTSY_CLIENT_ID,
      client_secret: process.env.ARTSY_CLIENT_SECRET
    });

    if (!response.data || !response.data.token) {
      throw new Error('Invalid token response from Artsy API');
    }

    cachedToken = response.data.token;
    // Set expiration to 1 hour from now (in milliseconds)
    tokenExpiration = Date.now() + (60 * 60 * 1000);
    
    return cachedToken;
  } catch (error) {
    console.error('Error getting Artsy token:', error.message);
    throw error;
  }
};

/**
 * Search for artists
 * @param {string} query - Search query
 * @returns {Promise<Array>} Array of artist objects
 */
exports.searchArtists = async (query) => {
  try {
    if (!query || query.trim() === '') {
      console.error('Empty search query');
      return [];
    }

    const token = await getArtsyToken();
    
    const response = await axios.get('https://api.artsy.net/api/search', {
      params: {
        q: query,
        type: 'artist',
        size: 10
      },
      headers: {
        'X-XAPP-Token': token
      }
    });

    if (!response.data || !response.data._embedded || !response.data._embedded.results) {
      console.error('Unexpected Artsy API response structure for search:', 
        JSON.stringify(response.data, null, 2).substring(0, 200) + '...');
      return [];
    }

    return response.data._embedded.results;
  } catch (error) {
    console.error('Artsy service error (searchArtists):', 
      error.response ? error.response.data : error.message);
    return [];
  }
};

/**
 * Get artist details
 * @param {string} artistId - Artist ID
 * @returns {Promise<Object>} Artist details object
 */
exports.getArtistDetails = async (artistId) => {
  try {
    if (!artistId || artistId === 'undefined') {
      console.error('Invalid artist ID for getArtistDetails:', artistId);
      throw new Error('Invalid artist ID');
    }

    const token = await getArtsyToken();
    
    console.log(`Making request to Artsy API for artist ${artistId}`);
    const response = await axios.get(`https://api.artsy.net/api/artists/${artistId}`, {
      headers: {
        'X-XAPP-Token': token
      }
    });

    return response.data;
  } catch (error) {
    console.error('Artsy service error (getArtistDetails):', 
      error.response ? error.response.data : error.message);
    throw error;
  }
};

/**
 * Get similar artists
 * @param {string} artistId - Artist ID
 * @returns {Promise<Array>} Array of similar artist objects
 */
exports.getSimilarArtists = async (artistId) => {
  try {
    if (!artistId || artistId === 'undefined') {
      console.error('Invalid artist ID for getSimilarArtists:', artistId);
      return [];
    }

    const token = await getArtsyToken();
    
    const response = await axios.get('https://api.artsy.net/api/artists', {
      params: {
        similar_to_artist_id: artistId,
        size: 10
      },
      headers: {
        'X-XAPP-Token': token
      }
    });

    if (!response.data || !response.data._embedded || !response.data._embedded.artists) {
      console.error('Unexpected Artsy API response structure for similar artists:', 
        JSON.stringify(response.data, null, 2).substring(0, 200) + '...');
      return [];
    }

    return response.data._embedded.artists;
  } catch (error) {
    console.error('Artsy service error (getSimilarArtists):', 
      error.response ? error.response.data : error.message);
    return [];
  }
};

/**
 * Get artist artworks
 * @param {string} artistId - Artist ID
 * @returns {Promise<Array>} Array of artwork objects
 */
exports.getArtistArtworks = async (artistId) => {
  try {
    if (!artistId || artistId === 'undefined') {
      console.error('Invalid artist ID for getArtistArtworks:', artistId);
      return [];
    }

    const token = await getArtsyToken();
    
    console.log(`Making request to Artsy API for artworks of artist ${artistId}`);
    const response = await axios.get('https://api.artsy.net/api/artworks', {
      params: {
        artist_id: artistId,
        size: 10
      },
      headers: {
        'X-XAPP-Token': token
      }
    });

    // Log the structure to help debug
    console.log('Artsy API response structure:', 
      Object.keys(response.data).join(', '), 
      response.data._embedded ? Object.keys(response.data._embedded).join(', ') : 'no _embedded');
    
    if (!response.data || !response.data._embedded || !response.data._embedded.artworks) {
      console.log('No artworks found or unexpected response structure:', 
        JSON.stringify(response.data, null, 2).substring(0, 200) + '...');
      return [];
    }

    return response.data._embedded.artworks;
  } catch (error) {
    console.error('Artsy service error (getArtistArtworks):', 
      error.response ? error.response.data : error.message);
    
    // Return empty array instead of throwing to prevent breaking the entire flow
    return [];
  }
};

/**
 * Get artwork categories
 * @param {string} artworkId - Artwork ID
 * @returns {Promise<Array>} Array of category objects
 */
exports.getArtworkCategories = async (artworkId) => {
  try {
    if (!artworkId || artworkId === 'undefined') {
      console.error('Invalid artwork ID for getArtworkCategories:', artworkId);
      return [];
    }

    const token = await getArtsyToken();
    
    const response = await axios.get('https://api.artsy.net/api/genes', {
      params: {
        artwork_id: artworkId,
        size: 10
      },
      headers: {
        'X-XAPP-Token': token
      }
    });

    if (!response.data || !response.data._embedded || !response.data._embedded.genes) {
      console.log('No categories found or unexpected response structure:', 
        JSON.stringify(response.data, null, 2).substring(0, 200) + '...');
      return [];
    }

    return response.data._embedded.genes;
  } catch (error) {
    console.error('Artsy service error (getArtworkCategories):', 
      error.response ? error.response.data : error.message);
    return [];
  }
};