const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

exports.generateAuthToken = (user) => {
    return jwt.sign(
        { uid: user.uid, publicKey: user.publicKey },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );
};

exports.authMiddleware = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findOne({ uid: decoded.uid });
        next();
    } catch (error) {
        res.status(401).send({ error: 'Authentication failed' });
    }
};
