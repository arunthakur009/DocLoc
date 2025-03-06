const User = require('../models/User');
const { generateAuthToken } = require('../utils/auth');
const { web3 } = require('../config/blockchain');
const { encryptData } = require('../utils/encryption');

exports.signup = async (req, res) => {
    try {
        const { uid } = req.body;
        if (await User.findOne({ uid })) return res.status(400).send({ error: 'User exists' });

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
