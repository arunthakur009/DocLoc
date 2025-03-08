const express = require('express');
require('dotenv').config();

const connectDB = require('./src/config/db.js');
const userRoutes = require('./src/api/userRoutes.js');
const documentRoutes = require('./src/api/documentRoutes.js');

// Connect to database
connectDB();

const app = express();
app.use(express.json());

// Add CORS headers middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // Handle preflight OPTIONS requests
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Add a root route to prevent code exposure
app.get('/', (req, res) => {
    res.send('API is working! Go to /api/users or /api/documents');
});

// Define API routes
app.use('/api/', userRoutes);
app.use('/api/documents', documentRoutes);

// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

