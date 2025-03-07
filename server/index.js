const express = require('express');
require('dotenv').config();

const connectDB = require('./src/config/db.js');
const userRoutes = require('./src/api/userRoutes.js');
const documentRoutes = require('./src/api/documentRoutes.js');

// Connect to database
connectDB();

const app = express();
app.use(express.json());

// Add a root route to prevent code exposure
app.get('/', (req, res) => {
    res.send('API is working! Go to /api/users or /api/documents');
});

// Define API routes
app.use('/api/', userRoutes);
app.use('/api/documents', documentRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

