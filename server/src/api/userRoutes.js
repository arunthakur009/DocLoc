const express = require('express');
const { 
  signup, 
  login, 
  setKey, 
  blockchainLogin, 
  blockchainLogout 
} = require('../controllers/userController');
const { authMiddleware } = require('../utils/auth');

const app = express();
app.use(express.json());

// Basic auth endpoints
app.post('/signup', signup);
app.post('/login', login);

// Smart contract related endpoints
app.post('/set-key', authMiddleware, setKey);
app.post('/blockchain-login', authMiddleware, blockchainLogin);
app.post('/blockchain-logout', authMiddleware, blockchainLogout);

app.get('/', (req, res) => {
  res.json({ message: 'User API is working!' });
});

module.exports = app;