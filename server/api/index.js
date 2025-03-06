const express = require('express');
const { createServer } = require('@vercel/node');  // Vercel specific
require('dotenv').config();

const connectDB = require('../src/config/db');  // Adjust path if needed
const userRoutes = require('../src/routes/userRoutes');
const documentRoutes = require('../src/routes/documentRoutes');

connectDB();
const app = express();
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/documents', documentRoutes);

// Export serverless function
module.exports = createServer(app);
