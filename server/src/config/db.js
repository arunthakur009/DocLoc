const mongoose = require('mongoose');
require('dotenv').config();

// MongoDB connection URI - you should store this in your .env file
// MONGODB_URI=mongodb+srv://nk9599341:<db_password>@doclocker09.jfqtx.mongodb.net/?retryWrites=true&w=majority&appName=doclocker09
// Replace <db_password> with your actual password in the .env file

const connectDB = async () => {
    try {
        // Modern connection without deprecated options
        await mongoose.connect(process.env.MONGODB_URI);
        
        // Test the connection with a ping
        const admin = mongoose.connection.db.admin();
        await admin.ping();
        
        console.log("MongoDB Connected Successfully!");
    } catch (error) {
        console.error("MongoDB Connection Failed:", error.message);
        // Provide more specific error information
        if (error.name === 'MongoServerSelectionError') {
            console.error("Could not connect to any servers in your MongoDB Atlas cluster. Check your connection string and network settings.");
        }
        process.exit(1);
    }
};

module.exports = connectDB;