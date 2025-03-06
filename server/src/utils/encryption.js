const crypto = require('crypto-js');

exports.encryptData = (data, key) => crypto.AES.encrypt(data, key).toString();

exports.decryptData = (ciphertext, key) => 
    crypto.AES.decrypt(ciphertext, key).toString(crypto.enc.Utf8);
