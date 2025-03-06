const express = require('express');
const multer = require('multer');
const { uploadDocument, getUserDocuments } = require('../controllers/documentController');
const { authMiddleware } = require('../utils/auth');

const app = express();
app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() });

app.post('/upload', authMiddleware, upload.single('file'), uploadDocument);
app.get('/user-documents', authMiddleware, getUserDocuments);
app.get('/', (req, res) => res.json({ message: 'Document API is working!' }));

module.exports = app; // ✅ Vercel handles the server

