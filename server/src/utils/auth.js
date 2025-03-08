const jwt = require('jsonwebtoken');
const User = require('../models/user');
const path = require('path');
require('dotenv').config();

// Import Web3 with fallback for different versions
const Web3Lib = require('web3');
const Web3 = Web3Lib.default || Web3Lib;

// Load contract ABI
const contractJson = require(path.resolve(__dirname, '../../artifacts/contracts/digital.sol/EnhancedDigitalLocker.json'));
const ethUtil = require('ethereumjs-util');

// Initialize Web3 with error handling
let web3, contract;
try {
  const providerUrl = process.env.BLOCKCHAIN_PROVIDER;
  web3 = new Web3(providerUrl);
  
  contract = new web3.eth.Contract(
    contractJson.abi,
    process.env.CONTRACT_ADDRESS
  );
  console.log('Web3 initialized successfully');
} catch (error) {
  console.error('Error initializing Web3:', error.message);
  throw error;
}

// Generate a nonce for signing
const generateNonce = () => {
  return Math.floor(Math.random() * 1000000).toString();
};

// Rest of your code remains the same...

// Login with wallet signature instead of private key
exports.login = async (req, res) => {
  try {
    const { publicKey, signature, userKey, nonce } = req.body;
    
    if (!publicKey || !signature || !userKey || !nonce) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Find user by publicKey
    let user = await User.findOne({ publicKey });
    if (!user) {
      // Optional: create new user if they don't exist
      user = new User({ publicKey, uid: web3.utils.sha3(publicKey) });
      await user.save();
    }
    
    // Verify signature
    const message = `Login to DocLocker with key: ${userKey} (Nonce: ${nonce})`;
    const messageHash = web3.utils.sha3(message);
    const sigParams = ethUtil.fromRpcSig(signature);
    const publicKeyRecovered = ethUtil.ecrecover(
      ethUtil.toBuffer(messageHash),
      sigParams.v,
      sigParams.r,
      sigParams.s
    );
    const addressBuffer = ethUtil.publicToAddress(publicKeyRecovered);
    const recoveredAddress = ethUtil.bufferToHex(addressBuffer);
    
    if (recoveredAddress.toLowerCase() !== publicKey.toLowerCase()) {
      return res.status(401).json({ error: 'Invalid signature' });
    }
    
    // Use view function to check if key is valid (no transaction needed)
    // Assuming contract has a view function to validate keys
    const isValidKey = await contract.methods.validateKey(publicKey, userKey).call();
    
    if (!isValidKey) {
      return res.status(401).json({ error: 'Invalid key' });
    }
    
    // Use meta-transaction for blockchain login (optional)
    // This would be handled by a relayer service
    
    // Generate JWT with longer expiry and refresh token
    const token = jwt.sign(
      { uid: user.uid, publicKey: user.publicKey },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    const refreshToken = jwt.sign(
      { uid: user.uid },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '7d' }
    );
    
    // Store refresh token in database
    user.refreshToken = refreshToken;
    await user.save();
    
    res.status(200).json({
      message: 'Login successful',
      token,
      refreshToken,
      user: {
        uid: user.uid,
        publicKey: user.publicKey
      }
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed', details: error.message });
  }
};

// Refresh token endpoint
exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token required' });
    }
    
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findOne({ uid: decoded.uid, refreshToken });
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }
    
    const newToken = jwt.sign(
      { uid: user.uid, publicKey: user.publicKey },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.status(200).json({ token: newToken });
    
  } catch (error) {
    res.status(401).json({ error: 'Invalid refresh token' });
  }
};

// Middleware with optimized blockchain verification
exports.authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ uid: decoded.uid });
    
    if (!user) {
      throw new Error('User not found');
    }
    
    // Skip blockchain verification for non-critical endpoints
    // or use caching to reduce blockchain calls
    if (req.path.includes('/critical') || Math.random() < 0.1) { // 10% chance to verify
      const isLoggedIn = await contract.methods.loggedIn(user.publicKey).call();
      if (!isLoggedIn) {
        throw new Error('User not logged in on blockchain');
      }
    }
    
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Authentication failed', details: error.message });
  }
};