require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

const PINATA_API_KEY = process.env.PINATA_API_KEY;
const PINATA_SECRET_KEY = process.env.PINATA_SECRET_KEY;
console.log("PINATA_API_KEY:", process.env.PINATA_API_KEY);
console.log("PINATA_SECRET_KEY:", process.env.PINATA_SECRET_KEY);
// **API Endpoint to Verify Hash on Pinata (IPFS)**
app.post("/verify", async (req, res) => {
    console.log("🔍 Received request to /verify");

    const { hash } = req.body;
    console.log("📌 Received hash:", hash); // Log the hash received from frontend

    if (!hash) {
        console.log("❌ Error: No hash provided!");
        return res.status(400).json({ error: "Hash is required" });
    }

    try {
        console.log("🔗 Sending request to Pinata API...");
        const pinataResponse = await axios.get(`https://api.pinata.cloud/data/pinList?hashContains=${hash}`, {
            headers: {
                pinata_api_key: PINATA_API_KEY,
                pinata_secret_api_key: PINATA_SECRET_KEY,
            }
        });

        console.log("✅ Pinata Response:", pinataResponse.data); // Log the API response

        const isOnIPFS = pinataResponse.data.count > 0;

        res.json({
            status: isOnIPFS ? "Verified" : "Not Verified",
            message: isOnIPFS ? "Document is on IPFS." : "Document not found."
        });
    } catch (error) {
        console.error("🚨 Verification Error:", error.response?.data || error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
