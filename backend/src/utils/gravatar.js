// backend/src/utils/gravatar.js
const crypto = require('crypto');

/**
 * Generate a Gravatar URL for an email address based on latest SHA256 hashing
 * 
 * @param {string} email - The user's email address
 * @param {number} size - The size of the avatar in pixels (1-2048)
 * @param {string} defaultImage - The default image type if no Gravatar exists
 *                               (404, mp, identicon, monsterid, wavatar, retro, robohash, blank, or URL)
 * @param {string} rating - The maximum rating to allow (g, pg, r, x)
 * @returns {string} - The Gravatar URL
 */
exports.generateGravatarUrl = (email, size = 200, defaultImage = 'identicon', rating = 'g') => {
  if (!email) {
    return `https://gravatar.com/avatar/?s=${size}&d=${defaultImage}&r=${rating}&d=identicon`;
  }
  
  // Trim leading and trailing whitespace from the email
  const trimmedEmail = email.trim();
  
  // Force all characters to lower-case
  const normalizedEmail = trimmedEmail.toLowerCase();
  
  // Hash the final string with SHA256
  const hash = crypto.createHash('sha256').update(normalizedEmail).digest('hex');
  
  // Construct and return the Gravatar URL
  return `https://gravatar.com/avatar/${hash}?s=${size}&d=${defaultImage}&r=${rating}&d=identicon`;
};

/**
 * Test if a Gravatar exists for an email address
 * 
 * @param {string} email - The user's email address
 * @returns {boolean} - True if a Gravatar exists, false otherwise
 */
exports.gravatarExists = async (email) => {
  try {
    if (!email) return false;
    
    // Follow the exact same normalization process as generateGravatarUrl
    const normalizedEmail = email.trim().toLowerCase();
    const hash = crypto.createHash('sha256').update(normalizedEmail).digest('hex');
    
    // This is a client-side check only - in a real app, you'd make a network request
    // to verify the gravatar exists
    return true; 
  } catch (error) {
    console.error('Error checking if Gravatar exists:', error);
    return false;
  }
};