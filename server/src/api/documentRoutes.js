const express = require('express');
const multer = require('multer');
const { 
  uploadDocument, 
  getUserDocuments, 
  setUserKey,
  login,
  logout,
  grantAccess,
  revokeAccess
} = require('../controllers/documentController');
const { authMiddleware } = require('../utils/auth');

const app = express();
app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() });

// Original routes
app.post('/upload', authMiddleware, upload.single('file'), uploadDocument);
app.get('/user-documents', authMiddleware, getUserDocuments);

// New routes to match smart contract functionality
app.post('/set-key', authMiddleware, setUserKey);
app.post('/login', authMiddleware, login);
app.post('/logout', authMiddleware, logout);
app.post('/grant-access', authMiddleware, grantAccess);
app.post('/revoke-access', authMiddleware, revokeAccess);

app.get('/', (req, res) => res.json({ message: 'Document API is working!' }));

module.exports = app;

