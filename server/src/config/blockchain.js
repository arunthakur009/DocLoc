const Web3 = require('web3');
require('dotenv').config();
const contractABI = require('../contractABI.json');

const web3 = new Web3(
    new Web3.providers.HttpProvider(
        `https://${process.env.NETWORK}.infura.io/v3/${process.env.INFURA_PROJECT_ID}`
    )
);
const contract = new web3.eth.Contract(
    contractABI,
    process.env.CONTRACT_ADDRESS
);

module.exports = { web3, contract };
