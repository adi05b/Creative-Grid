// Script to check users in MongoDB
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');

console.log('Checking users in MongoDB database...');
console.log('Connection string (masked):', process.env.MONGODB_URI.replace(/mongodb\+srv:\/\/([^:]+):([^@]+)@/, 'mongodb+srv://****:****@'));

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB successfully');
    
    // List all users
    try {
      const users = await User.find({}).select('-password');
      console.log(`Total users in database: ${users.length}`);
      
      if (users.length === 0) {
        console.log('No users found in the database');
      } else {
        users.forEach((user, index) => {
          console.log(`User ${index + 1}:`);
          console.log(`- ID: ${user._id}`);
          console.log(`- Name: ${user.fullname}`);
          console.log(`- Email: ${user.email}`);
          console.log(`- Profile Image: ${user.profileImageUrl}`);
          console.log(`- Created at: ${user.createdAt}`);
          console.log('------------------------');
        });
      }
      
      // Check database details
      console.log('\nDatabase connection details:');
      console.log(`- Database name: ${mongoose.connection.name}`);
      console.log(`- Host: ${mongoose.connection.host}`);
      console.log(`- Collections: ${Object.keys(mongoose.connection.collections).join(', ')}`);
      
      // Check if users collection exists
      const collections = await mongoose.connection.db.listCollections().toArray();
      const collectionNames = collections.map(c => c.name);
      console.log('\nCollections in database:', collectionNames);
      
      if (!collectionNames.includes('users')) {
        console.warn('Warning: "users" collection does not exist in the database');
      }
      
    } catch (error) {
      console.error('Error retrieving users:', error);
    }
    
    // Close the connection
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