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
        const { uid } = req.body;
        const user = await User.findOne({ uid });
        if (!user) {
            return res.status(400).send({ error: 'User does not exist' });
        }

        // You can add more detailed authentication if needed,
        // for now we're just issuing a token assuming the user is authenticated.
        const token = generateAuthToken(user);
        res.status(200).send({ user, token });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
};

exports.setKey = async (req, res) => {
    try {
        const { uid } = req.user;
        // Add your key setting logic here
        
        res.status(200).send({ message: 'Key set successfully' });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
};

exports.blockchainLogin = async (req, res) => {
    try {
        const { uid } = req.user;
        // Add your blockchain login logic here
        
        res.status(200).send({ message: 'Blockchain login successful' });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
};

exports.blockchainLogout = async (req, res) => {
    try {
        const { uid } = req.user;
        // Add your blockchain logout logic here
        
        res.status(200).send({ message: 'Blockchain logout successful' });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
};
