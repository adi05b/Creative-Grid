const axios = require('axios');
require('dotenv').config();

// Token caching to avoid requesting a new token for every API call
let token = null;
let tokenExpiration = null;

const getArtsyToken = async () => {
  // Check if we have a valid token already
  if (token && tokenExpiration && new Date() < tokenExpiration) {
    return token;
  }

  try {
    const response = await axios.post('https://api.artsy.net/api/tokens/xapp_token', {
      client_id: process.env.ARTSY_CLIENT_ID,
      client_secret: process.env.ARTSY_CLIENT_SECRET
    });

    token = response.data.token;
    
    // Set expiration time (usually 60 minutes from now)
    const expiresIn = response.data.expires_in || 3600;
    tokenExpiration = new Date(Date.now() + expiresIn * 1000);
    
    console.log('New Artsy token obtained, expires:', tokenExpiration);
    return token;
  } catch (error) {
    console.error('Failed to get Artsy token:', error.message);
    throw new Error('Failed to get Artsy API token');
  }
};

module.exports = getArtsyToken;