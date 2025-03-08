const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    uid: { type: String, required: true, unique: true },
    publicKey: String,
    encryptedPrivateKey: String,
    blockchainKey: String, // Add this field to store the blockchain key
    blockchainRegistered: { type: Boolean, default: false },
    documents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Document' }]
});

module.exports = mongoose.model('User', UserSchema);
