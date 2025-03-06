const express = require('express');
const multer = require('multer');
const { uploadDocument, getUserDocuments } = require('../controllers/documentController');
const { authMiddleware } = require('../utils/auth');
const { createServer } = require('@vercel/node');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// 📌 Upload a document (POST)
router.post('/upload', authMiddleware, upload.single('file'), uploadDocument);

// 📌 Get user documents (GET)
router.get('/user-documents', authMiddleware, getUserDocuments);

// 📌 Health check route (GET)
router.get('/', (req, res) => {
    res.json({ message: 'Document API is working!' });
});

const app = express();
app.use(express.json());
app.use('/api/documents', router);

module.exports = createServer(app);
