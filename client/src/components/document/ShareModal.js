import React, { useState } from 'react';
import axios from 'axios';
//import './ShareModal.css';

const ShareModal = ({ document, onClose }) => {
  const [userAddress, setUserAddress] = useState('');
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!userAddress) {
      setError('Please enter a valid blockchain address');
      return;
    }
    
    setProcessing(true);
    setError('');
    
    try {
      await axios.post('/api/documents/grant-access', { userAddress });
      setSuccess(true);
      setProcessing(false);
      
      // Close modal after a short delay
      setTimeout(() => {
        onClose();
      }, 2000);
      
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to share document. Please try again.');
      setProcessing(false);
    }
  };

  return (
    <div className="share-modal">
      <div className="share-content">
        <button className="close-button" onClick={onClose}>×</button>
        
        <h2>Share Document</h2>
        <p className="document-info">
          Document ID: {document.cid.substring(0, 16)}...
        </p>
        
        {error && <div className="share-error">{error}</div>}
        
        {success ? (
          <div className="share-success">
            <p>Document successfully shared!</p>
            <p>The user now has access to this document.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="userAddress">Recipient's Blockchain Address</label>
              <input 
                type="text" 
                id="userAddress" 
                value={userAddress}
                onChange={(e) => setUserAddress(e.target.value)}
                placeholder="0x..."
                disabled={processing}
                required
              />
              <small>Enter the Ethereum address of the recipient</small>
            </div>
            
            <div className="share-actions">
              <button 
                type="button" 
                className="cancel-button" 
                onClick={onClose}
                disabled={processing}
              >
                Cancel
              </button>
              
              <button 
                type="submit" 
                className="share-button"
                disabled={processing || !userAddress}
              >
                {processing ? 'Processing...' : 'Share Document'}
              </button>
            </div>
          </form>
        )}
        
        <div className="share-info">
          <p>Document access is controlled via the blockchain</p>
          <p>You can revoke access at any time</p>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;