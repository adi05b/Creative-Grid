
/**
 * Module dependencies.
 */
const app = require('./src/app');
const http = require('http');
const mongoose = require('mongoose');
require('dotenv').config();

const cors = require('cors');

// In your app.js or server.js before your routes
app.use(cors({
  // origin: true,
  // credentials: true
}));

/**
 * Get port from environment and store in Express.
 */
const port = normalizePort(process.env.PORT || '8000');
app.set('port', port);

/**
 * Connect to MongoDB
 */
console.log('Attempting to connect to MongoDB...');
console.log('Connection string (masked):', process.env.MONGODB_URI.replace(/mongodb\+srv:\/\/([^:]+):([^@]+)@/, 'mongodb+srv://****:****@'));

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB successfully');
    
    // Log connection details
    const { host, name, port, user } = mongoose.connection;
    console.log(`Database details - Host: ${host}, Name: ${name}, Port: ${port}, User: ${user || 'none'}`);

    // Check if we can write to the database
    console.log('MongoDB connection is ready:', mongoose.connection.readyState === 1 ? 'Yes' : 'No');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    console.error('Connection error code:', err.code);
    console.error('Connection error message:', err.message);
    
    if (err.name === 'MongoServerError') {
      console.error('This is a MongoDB server error, check your credentials and network');
    }
    
    process.exit(1);
  });

/**
 * Create HTTP server.
 */
const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  console.log('Listening on ' + bind);
}