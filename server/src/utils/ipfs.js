const { create } = require('ipfs-http-client');
require('dotenv').config();

const ipfs = create({
    host: 'api.pinata.cloud',
    port: 5001,
    protocol: 'https',
    headers: {
        authorization: `Basic ${Buffer.from(
            `${process.env.PINATA_SECRET_API_KEY}:${process.env.PINATA_SECRET_API_KEY}`
        ).toString('base64')}`
    }
});

module.exports = ipfs;
