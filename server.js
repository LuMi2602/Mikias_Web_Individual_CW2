// server.js
const express = require('express');
const logger = require('./logger');

const app = express();

// Apply logger middleware to log all requests
app.use(logger);

// Define your routes and other middleware
// ...

// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});






