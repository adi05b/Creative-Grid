// backend/src/controllers/authController.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { generateGravatarUrl } = require('../utils/gravatar');

// JWT token expiration (1 hour)
const TOKEN_EXPIRATION = '1h';

/**
 * Register a new user
 */
exports.register = async (req, res, next) => {
  try {
    console.log("Registration attempt with data:", {
      fullname: req.body.fullname,
      email: req.body.email,
      hasPassword: !!req.body.password
    });

    const { fullname, email, password } = req.body;

    // Check for required fields
    if (!fullname || !email || !password) {
      console.log("Missing required fields");
      return res.status(400).json({
        status: 'error',
        message: 'Please provide all required fields'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    console.log("Existing user check:", existingUser ? "Found" : "Not found");
    
    if (existingUser) {
      return res.status(400).json({
        status: 'error',
        message: 'Email already exists'
      });
    }

    // Generate Gravatar URL
    const profileImageUrl = generateGravatarUrl(email);
    console.log("Generated Gravatar URL:", profileImageUrl);

    // Create new user
    const user = new User({
      fullname,
      email,
      password, // Will be hashed by pre-save hook in User model
      profileImageUrl
    });
    
    console.log("About to save user:", {
      fullname: user.fullname,
      email: user.email,
      profileImageUrl: user.profileImageUrl
    });

    // Save user to database with explicit try/catch
    try {
      const savedUser = await user.save();
      console.log("User saved successfully with ID:", savedUser._id);
    } catch (saveError) {
      console.error("Error saving user to database:", saveError);
      throw saveError;
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: TOKEN_EXPIRATION }
    );
    console.log("JWT token generated");

    // Set JWT as HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600000,
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      domain: process.env.NODE_ENV === 'production' ? 'ab-web-tech-project2.wl.r.appspot.com' : undefined
    });

    // Return user data (without password)
    const userData = {
      id: user._id,
      fullname: user.fullname,
      email: user.email,
      profileImageUrl: user.profileImageUrl
    };

    console.log("Registration successful for user:", userData.email);
    res.status(201).json({
      status: 'success',
      data: userData
    });
  } catch (error) {
    console.error('Registration error:', error);
    next(error);
  }
};

/**
 * Login a user
 */
exports.login = async (req, res, next) => {
  try {
    console.log("Login attempt with email:", req.body.email);
    
    const { email, password } = req.body;

    // Check for required fields
    if (!email || !password) {
      console.log("Missing email or password");
      return res.status(400).json({
        status: 'error',
        message: 'Please provide email and password'
      });
    }

    // Find user by email
    const user = await User.findOne({ email });
    console.log("User found:", user ? "Yes" : "No");
    
    // Check if user exists and password matches
    if (!user) {
      console.log("User not found");
      return res.status(401).json({
        status: 'error',
        message: 'Invalid email or password'
      });
    }
    
    // Check password match
    const passwordMatch = await user.comparePassword(password);
    console.log("Password match:", passwordMatch ? "Yes" : "No");
    
    if (!passwordMatch) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid email or password'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: TOKEN_EXPIRATION }
    );
    console.log("JWT token generated");

    // Set JWT as HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
      maxAge: 3600000, // 1 hour in milliseconds
      sameSite: 'lax'
    });
    console.log("Cookie set with token");

    // Return user data (without password)
    const userData = {
      id: user._id,
      fullname: user.fullname,
      email: user.email,
      profileImageUrl: user.profileImageUrl
    };

    console.log("Login successful for user:", userData.email);
    res.status(200).json({
      status: 'success',
      data: userData
    });
  } catch (error) {
    console.error('Login error:', error);
    next(error);
  }
};

/**
 * Get current user
 */
exports.getCurrentUser = async (req, res, next) => {
  try {
    // User ID is set by authenticated middleware
    const userId = req.userId;
    console.log("Getting current user with ID:", userId);
    
    if (!userId) {
      console.log("No user ID found, not authenticated");
      return res.status(401).json({
        status: 'error',
        message: 'Not authenticated'
      });
    }

    // Find user by ID
    const user = await User.findById(userId).select('-password');
    console.log("User found:", user ? "Yes" : "No");
    
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    console.log("Current user data retrieved for:", user.email);
    res.status(200).json({
      status: 'success',
      data: {
        id: user._id,
        fullname: user.fullname,
        email: user.email,
        profileImageUrl: user.profileImageUrl
      }
    });
  } catch (error) {
    console.error('Get current user error:', error);
    next(error);
  }
};

/**
 * Logout a user
 */
exports.logout = async (req, res, next) => {
  try {
    console.log("Logout attempt");
    
    // Clear the token cookie
    res.clearCookie('token');
    console.log("Token cookie cleared");
    
    res.status(200).json({
      status: 'success',
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);
    next(error);
  }
};

/**
 * Delete user account
 */
exports.deleteAccount = async (req, res, next) => {
  try {
    // User ID is set by authenticated middleware
    const userId = req.userId;
    console.log("Delete account attempt for user ID:", userId);
    
    if (!userId) {
      console.log("No user ID found, not authenticated");
      return res.status(401).json({
        status: 'error',
        message: 'Not authenticated'
      });
    }

    // Delete user from database
    const deletedUser = await User.findByIdAndDelete(userId);
    console.log("User deleted:", deletedUser ? "Yes" : "No");
    
    // Clear the token cookie
    res.clearCookie('token');
    console.log("Token cookie cleared");
    
    res.status(200).json({
      status: 'success',
      message: 'Account deleted successfully'
    });
  } catch (error) {
    console.error('Delete account error:', error);
    next(error);
  }
};