const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    docType: String,
    ipfsHash: String,
    verified: Boolean,
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Document', DocumentSchema);
