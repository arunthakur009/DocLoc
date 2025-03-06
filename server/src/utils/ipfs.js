const { create } = require('ipfs-http-client');
require('dotenv').config();

const ipfs = create({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    headers: {
        authorization: `Basic ${Buffer.from(
            `${process.env.INFURA_PROJECT_ID}:${process.env.INFURA_PROJECT_SECRET}`
        ).toString('base64')}`
    }
});

module.exports = ipfs;
