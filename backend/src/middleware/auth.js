const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware for protected routes - only allows authenticated users
exports.authenticated = async (req, res, next) => {
  try {
    // Get token from cookie
    const token = req.cookies.token;
    
    if (!token) {
      return res.status(401).json({ error: 'Access denied. Please log in.' });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if user exists
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ error: 'Invalid token. User not found.' });
    }
    
    // Set user ID in request object for use in controllers
    req.userId = user._id;
    
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired. Please login again.' });
    }
    
    console.error('Authentication error:', error);
    res.status(401).json({ error: 'Invalid token. Please login again.' });
  }
};

// Middleware for routes that should only be accessed by non-authenticated users
exports.unauthenticated = async (req, res, next) => {
  try {
    // Get token from cookie
    const token = req.cookies.token;
    
    // If token exists, user is already authenticated
    if (token) {
      try {
        // Verify the token is valid
        jwt.verify(token, process.env.JWT_SECRET);
        return res.status(403).json({ error: 'You are already logged in.' });
      } catch (err) {
        // If token is invalid (expired, etc.), we can continue as unauthenticated
        next();
        return;
      }
    }
    
    // If no token, user is not authenticated, allow to proceed
    next();
  } catch (error) {
    console.error('Unauthenticated middleware error:', error);
    next();
  }
};

// Optional middleware to check authentication status without blocking
exports.checkAuth = async (req, res, next) => {
  try {
    // Get token from cookie
    const token = req.cookies.token;
    
    if (token) {
      // Verify token
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Check if user exists
        const user = await User.findById(decoded.id).select('-password');
        if (user) {
          // Set user ID in request object for use in controllers
          req.userId = user._id;
        }
      } catch (err) {
        // Token is invalid, but we don't block the request
        req.userId = null;
      }
    } else {
      req.userId = null;
    }
    
    next();
  } catch (error) {
    console.error('CheckAuth middleware error:', error);
    req.userId = null;
    next();
  }
};