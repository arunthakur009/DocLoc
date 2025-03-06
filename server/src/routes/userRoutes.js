const express = require('express');
const { signup, login } = require('../controllers/userController');
const { createServer } = require('@vercel/node');

const router = express.Router();

// 📌 Signup route (POST)
router.post('/signup', signup);

// 📌 Login route (POST)
router.post('/login', login);

// 📌 Health check route (GET)
router.get('/', (req, res) => {
    res.json({ message: 'User API is working!' });
});

const app = express();
app.use(express.json());
app.use('/api/user', router);

module.exports = createServer(app);

