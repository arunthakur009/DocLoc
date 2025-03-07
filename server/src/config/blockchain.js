const Web3Lib = require('web3');
const Web3 = Web3Lib.default || Web3Lib;
require('dotenv').config();

// Mock ABI to prevent breaking when contractABI.json is not available
const contractABI = (() => {
    try {
        return require('../contractABI.json');
    } catch (error) {
        console.warn('contractABI.json not found, using empty ABI instead');
        return []; // Empty ABI as fallback
    }
})();

const providerUrl = `https://${process.env.NETWORK}.infura.io/v3/${process.env.INFURA_PROJECT_ID}`;
const web3 = new Web3(providerUrl);

const contract = new web3.eth.Contract(
        contractABI,
        process.env.CONTRACT_ADDRESS
);

module.exports = { web3, contract };
