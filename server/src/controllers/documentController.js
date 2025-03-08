const Document = require('../models/documents');
const ipfs = require('../utils/ipfs');
const { contract } = require('../config/blockchain');
const { encryptData, decryptData } = require('../utils/encryption');

// Function to upload a document
exports.uploadDocument = async (req, res) => {
    try {
        // Make sure user is logged in (contract has isLoggedIn modifier)
        if (!req.user) {
            return res.status(401).send({ error: 'User not authenticated' });
        }
        
        // Encrypt the file
        const encryptedFile = encryptData(req.file.buffer.toString('hex'), process.env.ENCRYPTION_KEY);
        
        // Upload to IPFS
        const { cid } = await ipfs.add(Buffer.from(encryptedFile), req.body.docType);
        
        // Save document metadata in MongoDB
        const document = new Document({ 
            userId: req.user._id, 
            docType: req.body.docType, 
            ipfsHash: cid.toString(), 
            verified: false 
        });
        await document.save();
        
        // Get user's key from request
        const userKey = req.user.key; // Assuming key is stored in user object
        
        // Add document to blockchain using the user's key
        await contract.methods.addDocument(
            userKey, 
            cid.toString(), 
            req.body.docType
        ).send({ from: req.user.publicKey }); // Using user's public key as sender
        
        res.send({ document });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

// Function to get user documents
exports.getUserDocuments = async (req, res) => {
    try {
        // Get user's key
        const userKey = req.user.key;
        
        // Fetch documents using the key instead of UID
        const documents = await contract.methods.getDocumentsByKey(userKey).call({ from: req.user.publicKey });
        
        // Map the response to match expected format
        const formattedDocs = documents.map(doc => ({ 
            cid: doc.cid, 
            type: doc.docType, 
            timestamp: new Date(parseInt(doc.timestamp) * 1000) 
        }));
        
        res.send(formattedDocs);
    } catch (error) {
        res.status(500).send({ error: 'Failed to fetch documents' });
    }
};

// New function to set the user's key
exports.setUserKey = async (req, res) => {
    try {
        const { key } = req.body;
        
        if (!key) {
            return res.status(400).send({ error: 'Key is required' });
        }
        
        // Set the key in the blockchain
        await contract.methods.setKey(key).send({ from: req.user.publicKey });
        
        // Update user in database to store the key reference
        // This depends on your user model structure
        req.user.key = key;
        await req.user.save();
        
        res.send({ message: 'Key set successfully' });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

// Function to login with key
exports.login = async (req, res) => {
    try {
        const { key } = req.body;
        
        if (!key) {
            return res.status(400).send({ error: 'Key is required' });
        }
        
        // Login on the blockchain
        await contract.methods.login(key).send({ from: req.user.publicKey });
        
        res.send({ message: 'Login successful' });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

// Function to logout
exports.logout = async (req, res) => {
    try {
        // Logout on the blockchain
        await contract.methods.logout().send({ from: req.user.publicKey });
        
        res.send({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

// Function to grant access to another user
exports.grantAccess = async (req, res) => {
    try {
        const { userAddress } = req.body;
        
        if (!userAddress) {
            return res.status(400).send({ error: 'User address is required' });
        }
        
        // Grant access on the blockchain
        await contract.methods.allowAccess(userAddress).send({ from: req.user.publicKey });
        
        res.send({ message: 'Access granted successfully' });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

// Function to revoke access from another user
exports.revokeAccess = async (req, res) => {
    try {
        const { userAddress } = req.body;
        
        if (!userAddress) {
            return res.status(400).send({ error: 'User address is required' });
        }
        
        // Revoke access on the blockchain
        await contract.methods.disallowAccess(userAddress).send({ from: req.user.publicKey });
        
        res.send({ message: 'Access revoked successfully' });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};