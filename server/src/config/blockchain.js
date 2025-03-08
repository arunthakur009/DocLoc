const Web3Lib = require('web3');
const Web3 = Web3Lib.default || Web3Lib;
const path = require('path');
require('dotenv').config();

// Initialize Web3
const web3 = new Web3(process.env.BLOCKCHAIN_PROVIDER || 'http://127.0.0.1:8545');

// Load contract ABI
const contractJson = require(path.resolve(__dirname, '../../artifacts/contracts/digital.sol/EnhancedDigitalLocker.json'));

// Initialize contract
const contract = new web3.eth.Contract(
    contractJson.abi,
    process.env.CONTRACT_ADDRESS
);

// Export web3 and contract
module.exports = { web3, contract };

// Login user to blockchain
module.exports.loginUser = async (address, key) => {
    try {
      console.log(`Attempting to login user ${address} with key`);
      const gasEstimate = await contract.methods.login(key).estimateGas({ from: address });
      console.log(`Gas estimate for login: ${gasEstimate}`);
      
      const result = await contract.methods.login(key).send({ 
        from: address, 
        gas: Math.floor(gasEstimate * 1.5) // 50% buffer for safety
      });
      console.log(`Login transaction successful: ${result.transactionHash}`);
      return result;
    } catch (error) {
      console.error('Error logging in:', error.message);
      throw error;
    }
};

// Add user document to blockchain  
module.exports.addUserDocument = async (address, key, cid, docType) => {
    try {
      console.log(`Adding document for user ${address} with CID ${cid}`);
      const gasEstimate = await contract.methods.addDocument(key, cid, docType).estimateGas({ from: address });
      console.log(`Gas estimate for addDocument: ${gasEstimate}`);
      
      const result = await contract.methods.addDocument(key, cid, docType).send({ 
        from: address, 
        gas: Math.floor(gasEstimate * 1.5)
      });
      console.log(`Document added successfully: ${result.transactionHash}`);
      return result;
    } catch (error) {
      console.error('Error adding document:', error.message);
      throw error;
    }
};