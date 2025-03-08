const axios = require('axios');
const FormData = require('form-data');
require('dotenv').config();

const pinataEndpoint = 'https://api.pinata.cloud/pinning/pinFileToIPFS';
const pinataGateway = 'https://gateway.pinata.cloud/ipfs/';

// Keeping the same method name (add) for compatibility with existing code
exports.add = async (fileBuffer, docType = 'document') => {
  try {
    const formData = new FormData();
    
    // Add the file to the form data
    formData.append('file', fileBuffer, {
      filename: `${docType}_${Date.now()}`
    });
    
    // Add metadata including docType for better organization
    formData.append('pinataMetadata', JSON.stringify({
      name: `${docType}_${Date.now()}`,
      keyvalues: {
        type: docType,
        timestamp: Date.now().toString()
      }
    }));

    // Add pinning options (optional)
    formData.append('pinataOptions', JSON.stringify({
      cidVersion: 1
    }));
    
    // Make the API request to Pinata
    const response = await axios.post(pinataEndpoint, formData, {
      maxBodyLength: 'Infinity',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
        'pinata_api_key': process.env.PINATA_API_KEY,
        'pinata_secret_api_key': process.env.PINATA_SECRET_API_KEY
      }
    });
    
    // Return in the same format as the original ipfs client for compatibility
    return { cid: { toString: () => response.data.IpfsHash } };
  } catch (error) {
    console.error('Error uploading to IPFS:', error);
    throw new Error(`Failed to upload to IPFS: ${error.message}`);
  }
};

// Add a method to retrieve files from IPFS
exports.get = async (cid) => {
  try {
    const url = `${pinataGateway}${cid}`;
    const response = await axios.get(url, {
      responseType: 'arraybuffer'
    });
    return Buffer.from(response.data);
  } catch (error) {
    console.error('Error retrieving from IPFS:', error);
    throw new Error(`Failed to retrieve from IPFS: ${error.message}`);
  }
};

// Check if a file exists on IPFS
exports.exists = async (cid) => {
  try {
    const url = `${pinataGateway}${cid}`;
    const response = await axios.head(url);
    return response.status === 200;
  } catch (error) {
    return false;
  }
};

// Method to unpin a file if needed
exports.remove = async (cid) => {
  try {
    const response = await axios.delete(
      `https://api.pinata.cloud/pinning/unpin/${cid}`,
      {
        headers: {
          'pinata_api_key': process.env.PINATA_API_KEY,
          'pinata_secret_api_key': process.env.PINATA_SECRET_API_KEY
        }
      }
    );
    return response.status === 200;
  } catch (error) {
    console.error('Error removing from IPFS:', error);
    throw new Error(`Failed to remove from IPFS: ${error.message}`);
  }
};