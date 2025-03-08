import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './App.css';

// Components
import Sidebar from '../components/ui/SideBar';
import DocumentList from '../components/document/DocumentList';
import DocumentUpload from '../components/document/DocumentUpload';
import ShareModal from '../components/document/ShareModal';
import KeySetup from '../components/document/Keysetup';

const MainApp = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const [showUpload, setShowUpload] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [hasBlockchainKey, setHasBlockchainKey] = useState(false);
  const [isBlockchainLoggedIn, setIsBlockchainLoggedIn] = useState(false);
  
  const navigate = useNavigate();

  // Setup axios interceptor for authentication
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    // Set default authorization header
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    // Get user from localStorage
    const storedUser = JSON.parse(localStorage.getItem('user'));
    setUser(storedUser);
    
    // Check if user has blockchain key set
    checkBlockchainStatus();
    
    // Fetch documents
    fetchDocuments();
  }, []);

  const checkBlockchainStatus = async () => {
    try {
      // Check if user has blockchain key
      const keyResponse = await axios.get('/api/check-key');
      setHasBlockchainKey(keyResponse.data.hasKey);
      setIsBlockchainLoggedIn(keyResponse.data.isLoggedIn);
    } catch (err) {
      console.error('Error checking blockchain status:', err);
    }
  };

  const fetchDocuments = async () => {
    if (!isBlockchainLoggedIn) return;
    
    setLoading(true);
    try {
      const response = await axios.get('/api/documents/user-documents');
      setDocuments(response.data);
    } catch (err) {
      setError('Failed to fetch documents. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    // Logout from blockchain first
    axios.post('/api/blockchain-logout')
      .then(() => {
        // Clear local storage and redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      })
      .catch(err => {
        console.error('Logout error:', err);
        // Force logout even if blockchain logout fails
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      });
  };

  const handleUploadSuccess = () => {
    setShowUpload(false);
    fetchDocuments();
  };

  const handleShareDocument = (doc) => {
    setSelectedDocument(doc);
    setShowShareModal(true);
  };

  const handleBlockchainLogin = async (key) => {
    try {
      await axios.post('/api/blockchain-login', { key });
      setIsBlockchainLoggedIn(true);
      fetchDocuments();
    } catch (err) {
      setError('Blockchain login failed. Please check your key.');
    }
  };

  const handleSetKey = async (key) => {
    try {
      await axios.post('/api/set-key', { key });
      setHasBlockchainKey(true);
      handleBlockchainLogin(key);
    } catch (err) {
      setError('Failed to set key. Please try again.');
    }
  };

  // If user hasn't set up blockchain key, show setup screen
  if (!hasBlockchainKey) {
    return <KeySetup onSetKey={handleSetKey} />;
  }

  // If user has key but isn't logged in to blockchain, show login screen
  if (!isBlockchainLoggedIn) {
    return (
      <div className="blockchain-login">
        <h2>Enter your blockchain key to continue</h2>
        <KeySetup onSetKey={handleBlockchainLogin} buttonText="Login" />
      </div>
    );
  }

  return (
    <div className="app-container">
      <Sidebar 
        user={user}
        onLogout={handleLogout}
        onUpload={() => setShowUpload(true)}
      />
      
      <main className="main-content">
        <h1>Your Documents</h1>
        
        {error && <div className="error-banner">{error}</div>}
        
        {loading ? (
          <div className="loading">Loading documents...</div>
        ) : (
          <DocumentList 
            documents={documents}
            onShare={handleShareDocument}
          />
        )}
      </main>
      
      {showUpload && (
        <DocumentUpload 
          onClose={() => setShowUpload(false)}
          onSuccess={handleUploadSuccess}
        />
      )}
      
      {showShareModal && (
        <ShareModal
          document={selectedDocument}
          onClose={() => setShowShareModal(false)}
        />
      )}
    </div>
  );
};

export default MainApp;