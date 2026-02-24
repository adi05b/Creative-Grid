// Test database write functionality
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');

console.log('Starting MongoDB write test...');
console.log('Connection string (masked):', process.env.MONGODB_URI.replace(/mongodb\+srv:\/\/([^:]+):([^@]+)@/, 'mongodb+srv://****:****@'));

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB successfully');
    
    try {
      // Create a test user with unique email
      const timestamp = Date.now();
      const testUser = new User({
        fullname: 'Test User ' + timestamp,
        email: `test${timestamp}@example.com`,
        password: 'password123',
        profileImageUrl: 'https://www.gravatar.com/avatar/test'
      });
      
      console.log('Attempting to save test user:', {
        fullname: testUser.fullname,
        email: testUser.email
      });
      
      // Save the user
      const savedUser = await testUser.save();
      console.log('Test user saved successfully with ID:', savedUser._id);
      console.log('Saved user details:', {
        id: savedUser._id,
        fullname: savedUser.fullname,
        email: savedUser.email,
        profileImageUrl: savedUser.profileImageUrl,
        // Don't log the actual password hash
        hasPasswordHash: !!savedUser.password
      });
      
      // Check if we can retrieve the user
      console.log('Attempting to retrieve the saved user...');
      const foundUser = await User.findById(savedUser._id);
      
      if (foundUser) {
        console.log('Retrieved user successfully:', {
          id: foundUser._id,
          fullname: foundUser.fullname,
          email: foundUser.email
        });
      } else {
        console.error('Failed to retrieve user - not found');
      }
      
      // Check if we can query by email
      console.log('Attempting to find user by email...');
      const userByEmail = await User.findOne({ email: testUser.email });
      
      if (userByEmail) {
        console.log('Found user by email:', userByEmail.email);
      } else {
        console.error('Failed to find user by email');
      }
      
      // List all users
      console.log('Listing all users in database:');
      const allUsers = await User.find({}).select('-password');
      console.log(`Total users: ${allUsers.length}`);
      
      allUsers.forEach((user, i) => {
        console.log(`User ${i+1}: ${user.fullname} (${user.email})`);
      });
      
    } catch (error) {
      console.error('Error during database test:', error);
      if (error.name === 'ValidationError') {
        Object.keys(error.errors).forEach(field => {
          console.error(`Validation error in field "${field}": ${error.errors[field].message}`);
        });
      }
    }
    
    // Close connection
    await mongoose.connection.close();
    console.log('Database connection closed');
    process.exit(0);
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    console.error('Error details:', {
      name: err.name,
      message: err.message,
      code: err.code
    });
    process.exit(1);
  });