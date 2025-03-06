const Document = require('../models/Document');
const ipfs = require('../utils/ipfs');
const { contract } = require('../config/blockchain');
const { encryptData, decryptData } = require('../utils/encryption');

exports.uploadDocument = async (req, res) => {
    try {
        const encryptedFile = encryptData(req.file.buffer.toString('hex'), process.env.ENCRYPTION_KEY);
        const { cid } = await ipfs.add(Buffer.from(encryptedFile));

        const document = new Document({ userId: req.user._id, docType: req.body.docType, ipfsHash: cid.toString(), verified: false });
        await document.save();

        await contract.methods.addDocument(req.user.uid, cid.toString(), req.body.docType).send({ from: process.env.ADMIN_PUBLIC_KEY });

        res.send({ document });

    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

exports.getUserDocuments = async (req, res) => {
    try {
        const documents = await contract.methods.getDocumentsByUID(req.user.uid).call();
        res.send(documents.map(doc => ({ cid: doc.cid, type: doc.docType, timestamp: new Date(doc.timestamp * 1000) })));
    } catch (error) {
        res.status(500).send({ error: 'Failed to fetch documents' });
    }
};
