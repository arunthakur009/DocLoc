Blockchain-Based Digital Locker

A decentralized and secure document storage system using Blockchain, IPFS (Pinata), and Web3. Users can upload, verify, and retrieve documents with full ownership and privacy.# DocLoc
# DocLoc


Features 
✅ User Authentication → Secure login using unique UID(private key)(stored in MongoDB).
✅ Blockchain Integration → Smart contract stores document hashes for verification.
✅ Decentralized Storage → Documents stored on IPFS (Pinata) instead of centralized servers.
✅ Smart Contract Verification → Ensures document integrity and authenticity.
✅ Secure Access → Only the rightful owner can access their documents.




Technologies Used

Frontend (React.js)

React.js

Axios (for API calls)

Tailwind CSS (for UI styling)


Backend (Node.js, Express)

Express.js (REST API)

MongoDB (User authentication and metadata storage)

Web3.js (Blockchain interaction)

Pinata (IPFS document storage)

JWT (User authentication)


Blockchain (Ethereum)

Solidity (Smart contract development)

Infura (Ethereum node connection)


Installation & Setup

1️⃣ Backend Setup

cd backend  
npm install  
cp .env.example .env  # Add your API keys & secrets  
node server.js

2️⃣ Smart Contract Deployment

cd smart-contracts  
npm install  
npx hardhat compile  
npx hardhat run scripts/deploy.js --network goerli  # Use a testnet like Goerli

3️⃣ Frontend Setup

cd frontend  
npm install  
npm start





Sign Up & Login with your UID(private key).
2️⃣ Upload a Document → It gets stored on IPFS (Pinata), and its hash is added to Ethereum Smart Contract.
3️⃣ Retrieve Documents → The app fetches the document hash from blockchain and retrieves the file from Pinata.
4️⃣ Verify Authenticity → The hash is compared with blockchain records to ensure data integrity.



Why This Project?

🔹 Solves real-world issues → Document fraud, data loss, and lack of ownership.
🔹 Completely decentralized → Users control their data, not a third party.
🔹 Perfect for Web3 beginners → Covers full-stack, blockchain, and security.
🔹 Great for hackathons & job interviews → Demonstrates practical blockchain use cases.


Deployment Options

Backend: Deploy using Heroku, AWS, or Render.

Frontend: Deploy using Vercel or Netlify.

Smart Contract: Deploy to Ethereum Goerli, Polygon Mumbai, or any testnet.



Future Improvements

🔹 Multi-Signature Verification for added security.
🔹 NFT-Based Document Ownership for better tracking.
🔹 Support for Multiple File Types (images, PDFs, videos).
🔹 Gas Optimization for cheaper transactions.



Contributions Welcome! Fork this repo, improve it, and make a PR! 🚀