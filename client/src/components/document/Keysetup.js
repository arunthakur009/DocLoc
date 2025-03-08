import React, { useState } from 'react';
//import './KeySetup.css';

const KeySetup = ({ onSetKey, buttonText = "Set Key" }) => {
  const [key, setKey] = useState('');
  const [confirmKey, setConfirmKey] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate key
    if (key.length < 8) {
      setError('Key must be at least 8 characters long');
      return;
    }
    
    // If confirmation is needed (for initial setup)
    if (buttonText === "Set Key" && key !== confirmKey) {
      setError('Keys do not match');
      return;
    }
    
    // Call the provided function with the key
    onSetKey(key);
  };

  return (
    <div className="key-setup-container">
      <div className="key-setup-card">
        <h1>Blockchain Access Setup</h1>
        
        {buttonText === "Set Key" ? (
          <p className="setup-info">
            Create a secure key to access your documents on the blockchain.
            This key will be used to encrypt and access your documents.
            <strong>Keep this key safe - it cannot be recovered if lost!</strong>
          </p>
        ) : (
          <p className="setup-info">
            Enter your blockchain key to access your documents.
          </p>
        )}
        
        {error && <div className="key-error">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="key">Blockchain Key</label>
            <input
              type="password"
              id="key"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="Enter your secure key"
              required
            />
          </div>
          
          {buttonText === "Set Key" && (
            <div className="form-group">
              <label htmlFor="confirmKey">Confirm Key</label>
              <input
                type="password"
                id="confirmKey"
                value={confirmKey}
                onChange={(e) => setConfirmKey(e.target.value)}
                placeholder="Confirm your secure key"
                required
              />
            </div>
          )}
          
          <button 
            type="submit" 
            className="key-submit-button"
          >
            {buttonText}
          </button>
        </form>
        
        <div className="key-setup-warning">
          <p>Warning: This key is stored on the blockchain and cannot be recovered if lost.</p>
          <p>Make sure to save your key in a secure location.</p>
        </div>
      </div>
    </div>
  );
};

