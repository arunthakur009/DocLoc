const express = require('express');
const multer = require('multer');
const { uploadDocument, getUserDocuments } = require('../controllers/documentController');
const { authMiddleware } = require('../utils/auth');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload', authMiddleware, upload.single('file'), uploadDocument);
router.get('/user-documents', authMiddleware, getUserDocuments);

module.exports = router;
