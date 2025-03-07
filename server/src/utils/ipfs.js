const axios = require('axios');
const FormData = require('form-data');
require('dotenv').config();

const pinataEndpoint = 'https://api.pinata.cloud/pinning/pinFileToIPFS';

// Keeping the same method name (add) for compatibility with existing code
exports.add = async (fileBuffer, docType = 'document') => {
  try {
    const formData = new FormData();
    
    // Add the file to the form data
    formData.append('file', fileBuffer, {
      filename: docType
    });
    
    // Add metadata
    formData.append('pinataMetadata', JSON.stringify({
      name: docType
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
