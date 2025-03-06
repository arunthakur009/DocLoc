const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    uid: { type: String, required: true, unique: true },
    publicKey: String,
    encryptedPrivateKey: String,
    documents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Document' }]
});

module.exports = mongoose.model('User', UserSchema);
