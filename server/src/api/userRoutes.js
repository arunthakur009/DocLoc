const express = require('express');
const { 
  signup, 
  login, 
  setKey, 
  blockchainLogin, 
  blockchainLogout 
} = require('../controllers/userController');
const { authMiddleware } = require('../utils/auth');

const router = express.Router();

// Basic auth endpoints
router.post('/signup', signup);
router.post('/login', login);

// Smart contract related endpoints
router.post('/set-key', authMiddleware, setKey);
router.post('/blockchain-login', authMiddleware, blockchainLogin);
router.post('/blockchain-logout', authMiddleware, blockchainLogout);

router.get('/', (req, res) => {
  res.json({ message: 'User API is working!' });
});

module.exports = router;