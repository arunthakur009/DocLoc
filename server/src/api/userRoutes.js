const express = require('express');
const { signup, login } = require('../controllers/userController');

const app = express();
app.use(express.json());

app.post('/signup', signup);
app.post('/login', login);

app.get('/', (req, res) => {
    res.json({ message: 'User API is working!' });
});

// Export for Vercel
module.exports = app;


