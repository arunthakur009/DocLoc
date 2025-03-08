import React from 'react';
import { formatDistance } from 'date-fns';
//import './DocumentList.css';

// Icons (using Font Awesome)
import { FaFile, FaFileImage, FaFilePdf, FaFileWord, FaShareAlt, FaDownload } from 'react-icons/fa';

const DocumentList = ({ documents, onShare }) => {
  if (!documents || documents.length === 0) {
    return (
      <div className="empty-documents">
        <p>You don't have any documents yet.</p>
        <p>Upload documents to store them securely on the blockchain and IPFS.</p>
      </div>
    );
  }

  const getFileIcon = (docType) => {
    switch(docType.toLowerCase()) {
      case 'pdf':
        return <FaFilePdf className="file-icon pdf" />;
      case 'image':
      case 'jpg':
      case 'jpeg':
      case 'png':
        return <FaFileImage className="file-icon image" />;
      case 'doc':
      case 'docx':
        return <FaFileWord className="file-icon doc" />;
      default:
        return <FaFile className="file-icon default" />;
    }
  };

  const downloadDocument = async (cid) => {
    try {
      const response = await fetch(`/api/documents/download/${cid}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `document-${cid.substring(0, 8)}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download document. Please try again.');
    }
  };

  return (
    <div className="document-list">
      {documents.map((doc) => (
        <div key={doc.cid} className="document-card">
          <div className="document-icon">
            {getFileIcon(doc.type)}
          </div>
          
          <div className="document-info">
            <div className="document-type">{doc.type}</div>
            <div className="document-cid" title={doc.cid}>
              ID: {doc.cid.substring(0, 12)}...
            </div>
            <div className="document-time">
              {formatDistance(new Date(doc.timestamp), new Date(), { addSuffix: true })}
            </div>
          </div>
          
          <div className="document-actions">
            <button 
              className="action-button share"
              onClick={() => onShare(doc)}
              title="Share document"
            >
              <FaShareAlt />
            </button>
            
            <button 
              className="action-button download"
              onClick={() => downloadDocument(doc.cid)}
              title="Download document"
            >
              <FaDownload />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DocumentList;