// Add this to your existing module.exports
module.exports.loginUser = async (address, key) => {
    try {
      const gasEstimate = await contract.methods.login(key).estimateGas({ from: address });
      const result = await contract.methods.login(key).send({ 
        from: address, 
        gas: Math.floor(gasEstimate * 1.2) // 20% buffer
      });
      return result;
    } catch (error) {
      console.error('Error logging in:', error.message);
      throw error;
    }
  };
  
  module.exports.addUserDocument = async (address, key, cid, docType) => {
    try {
      const gasEstimate = await contract.methods.addDocument(key, cid, docType).estimateGas({ from: address });
      const result = await contract.methods.addDocument(key, cid, docType).send({ 
        from: address, 
        gas: Math.floor(gasEstimate * 1.2)
      });
      return result;
    } catch (error) {
      console.error('Error adding document:', error.message);
      throw error;
    }
  };