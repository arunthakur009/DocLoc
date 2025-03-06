const express = require('express');
require('dotenv').config();
const connectDB = require('./src/config/db');
const userRoutes = require('./src/routes/userRoutes');
const documentRoutes = require('./src/routes/documentRoutes');

connectDB();
const app = express();
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/documents', documentRoutes);

app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));

 