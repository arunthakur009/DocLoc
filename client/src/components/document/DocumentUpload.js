import React, { useState } from 'react';
import axios from 'axios';
//import './DocumentUpload.css';

const DocumentUpload = ({ onClose, onSuccess }) => {
  const [file, setFile] = useState(null);
  const [docType, setDocType] = useState('document');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    
    // Try to determine document type from file extension
    if (selectedFile) {
      const extension = selectedFile.name.split('.').pop().toLowerCase();
      
      if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) {
        setDocType('image');
      } else if (extension === 'pdf') {
        setDocType('pdf');
      } else if (['doc', 'docx'].includes(extension)) {
        setDocType('doc');
      } else {
        setDocType('document');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setError('Please select a file to upload');
      return;
    }
    
    setUploading(true);
    setProgress(0);
    setError('');
    
    // Create form data
    const formData = new FormData();
    formData.append('file', file);
    formData.append('docType', docType);
    
    try {
      // Configure request with upload progress
      const response = await axios.post('/api/documents/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setProgress(percentCompleted);
        }
      });
      
      // Simulate blockchain transaction time
      setProgress(100);
      setTimeout(() => {
        onSuccess(response.data.document);
      }, 1500);
      
    } catch (err) {
      setError(err.response?.data?.error || 'Upload failed. Please try again.');
      setUploading(false);
    }
  };

  return (
    <div className="upload-modal">
      <div className="upload-content">
        <button className="close-button" onClick={onClose}>×</button>
        
        <h2>Upload Document</h2>
        
        {error && <div className="upload-error">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="file">Select File</label>
            <input 
              type="file" 
              id="file" 
              onChange={handleFileChange}
              disabled={uploading}
            />
            {file && <div className="file-name">Selected: {file.name}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="docType">Document Type</label>
            <select 
              id="docType" 
              value={docType} 
              onChange={(e) => setDocType(e.target.value)}
              disabled={uploading}
            >
              <option value="document">General Document</option>
              <option value="image">Image</option>
              <option value="pdf">PDF</option>
              <option value="doc">Word Document</option>
            </select>
          </div>
          
          {uploading && (
            <div className="progress-container">
              <div 
                className="progress-bar" 
                style={{ width: `${progress}%` }}
              ></div>
              <div className="progress-text">
                {progress < 100 ? 'Uploading...' : 'Processing on blockchain...'}
                {progress}%
              </div>
            </div>
          )}
          
          <div className="upload-actions">
            <button 
              type="button" 
              className="cancel-button" 
              onClick={onClose}
              disabled={uploading}
            >
              Cancel
            </button>
            
            <button 
              type="submit" 
              className="upload-button"
              disabled={uploading || !file}
            >
              {uploading ? 'Uploading...' : 'Upload Document'}
            </button>
          </div>
        </form>
        
        <div className="upload-info">
          <p>Your document will be encrypted and stored on IPFS</p>
          <p>Document metadata will be secured on the blockchain</p>
        </div>
      </div>
    </div>
  );
};

export default DocumentUpload;