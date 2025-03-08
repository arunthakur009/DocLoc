const User = require('../models/user');
const { generateAuthToken } = require('../utils/auth');
const { web3 } = require('../config/blockchain');
const { encryptData } = require('../utils/encryption');

exports.signup = async (req, res) => {
    try {
        const { uid } = req.body;
        if (await User.findOne({ uid })) {
            return res.status(400).send({ error: 'User exists' });
        }

        const account = web3.eth.accounts.create();
        const encryptedPrivateKey = encryptData(account.privateKey, process.env.ENCRYPTION_KEY);

        const user = new User({ uid, publicKey: account.address, encryptedPrivateKey });
        await user.save();

        const token = generateAuthToken(user);
        res.status(201).send({ user, token });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { uid } = req.body; // uid is the private key
        
        // Create account from the private key
        let account;
        try {
            // Ensure proper 0x prefix on private key
            const formattedPrivateKey = uid.startsWith('0x') ? uid : `0x${uid}`;
            
            // Validate private key format before attempting to use it
            if (!/^0x[0-9a-fA-F]{64}$/.test(formattedPrivateKey)) {
                return res.status(400).send({ error: 'Invalid private key format - must be 64 hex characters' });
            }
            
            account = web3.eth.accounts.privateKeyToAccount(formattedPrivateKey);
            console.log("Account created successfully:", account.address);
        } catch (error) {
            console.error("Private key error:", error);
            return res.status(400).send({ error: 'Invalid private key - cannot create account' });
        }
        
        const userAddress = account.address;
        console.log("User address:", userAddress);
        
        // Find or create user record in MongoDB
        let user = await User.findOne({ publicKey: userAddress });
        if (!user) {
            // Create new user with this address
            const encryptedPrivateKey = encryptData(uid, process.env.ENCRYPTION_KEY);
            user = new User({ 
                uid: userAddress, // Using address as uid
                publicKey: userAddress, 
                encryptedPrivateKey
            });
            await user.save();
        }
        
        // Generate auth token for API access
        const token = generateAuthToken(user);
        
        res.status(200).send({ 
            user: {
                publicKey: userAddress
            },
            token
        });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
};

exports.setKey = async (req, res) => {
    try {
        const { key } = req.body;
        
        if (!key) {
            return res.status(400).send({ error: 'Key is required' });
        }
        
        // Import contract directly to avoid circular dependencies
        const { web3 } = require('../config/blockchain');
        
        // Get contract instance
        const path = require('path');
        const contractJson = require(path.resolve(__dirname, '../../artifacts/contracts/digital.sol/EnhancedDigitalLocker.json'));
        const contract = new web3.eth.Contract(
            contractJson.abi,
            process.env.CONTRACT_ADDRESS
        );
        
        try {
            // Send transaction to set key with higher gas limit
            await contract.methods.setKey(key).send({ 
                from: req.user.publicKey,
                gas: 300000
            });
            
            // Update user in database
            const user = await User.findOne({ publicKey: req.user.publicKey });
            if (user) {
                user.blockchainKey = key;
                user.blockchainRegistered = true;
                await user.save();
            }
            
            res.status(200).send({ 
                message: 'Key set successfully',
                userAddress: req.user.publicKey
            });
        } catch (error) {
            console.error('Blockchain error:', error);
            return res.status(400).send({ error: 'Blockchain error: ' + error.message });
        }
    } catch (error) {
        console.error('Error setting key:', error);
        res.status(500).send({ error: error.message });
    }
};

exports.blockchainLogin = async (req, res) => {
    try {
        // Try to get the key from the user record first
        const user = await User.findOne({ publicKey: req.user.publicKey });
        
        // Get key from request body or user record
        const key = req.body.key || (user ? user.blockchainKey : null);
        
        if (!key) {
            return res.status(400).send({ error: 'Key is required either in request or pre-registered' });
        }
        
        // Load contract and blockchain config
        const { loginUser } = require('../config/blockchain');
        
        try {
            // Call the blockchain login function
            const result = await loginUser(req.user.publicKey, key);
            console.log('Blockchain login success:', result);
            
            res.status(200).send({ 
                message: 'Blockchain login successful',
                transaction: result.transactionHash
            });
        } catch (error) {
            console.error('Blockchain login error:', error);
            return res.status(400).send({ 
                error: 'Blockchain login failed',
                details: error.message
            });
        }
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).send({ error: error.message });
    }
};

exports.blockchainLogout = async (req, res) => {
    try {
        // Load contract and blockchain config
        const path = require('path');
        const contractJson = require(path.resolve(__dirname, '../../artifacts/contracts/digital.sol/EnhancedDigitalLocker.json'));
        const { web3 } = require('../config/blockchain');
        const contract = new web3.eth.Contract(
            contractJson.abi,
            process.env.CONTRACT_ADDRESS
        );
        
        // Call logout function on the blockchain
        const result = await contract.methods.logout().send({ 
            from: req.user.publicKey,
            gas: 200000
        });
        
        res.status(200).send({ 
            message: 'Blockchain logout successful',
            transaction: result.transactionHash
        });
    } catch (error) {
        console.error('Blockchain logout error:', error);
        res.status(400).send({ error: error.message });
    }
};
