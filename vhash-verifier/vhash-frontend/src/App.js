import React, { useState } from "react";
import axios from "axios";
import QrScanner from "qr-scanner"; // Import QR scanner for image processing

function App() {
    const [hash, setHash] = useState("");
    const [result, setResult] = useState(null);

    // Verify Hash Function
    const verifyHash = async () => {
        if (!hash) {
            alert("Please enter or scan a hash.");
            return;
        }

        try {
            const response = await axios.post("http://localhost:5000/verify", { hash });
            setResult(response.data);
        } catch (error) {
            console.error("Verification Error:", error);
            setResult({ status: "Error", message: "Could not verify document." });
        }
    };

    // Handle QR Image Upload
    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        try {
            const scannedResult = await QrScanner.scanImage(file);
            setHash(scannedResult); // Set extracted text as hash
            alert(`QR Code scanned: ${scannedResult}`); // Show scanned hash
        } catch (error) {
            alert("Failed to read QR Code. Try another image.");
        }
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.heading}>🔍 VHash Verification System</h1>

            {/* QR Code Upload Option */}
            <p style={styles.orText}>Upload QR Code Image:</p>
            <input type="file" accept="image/*" onChange={handleImageUpload} style={styles.fileInput} />

            <p style={styles.orText}>OR Enter Hash Manually:</p>
            <input 
                type="text" 
                value={hash} 
                onChange={(e) => setHash(e.target.value)} 
                placeholder="Enter Document Hash"
                style={styles.input}
            />
            
            <br />
            <button onClick={verifyHash} style={styles.verifyButton}>
                Verify
            </button>

            {/* Display Verification Result */}
            {result && (
                <div style={styles.resultContainer}>
                    <h2>Status: {result.status}</h2>
                    <p>{result.message}</p>
                </div>
            )}
        </div>
    );
}

// 🌟 CSS Styles
const styles = {
    container: {
        textAlign: "center",
        padding: "40px",
        background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
        minHeight: "100vh",
        color: "white",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    heading: {
        fontSize: "28px",
        marginBottom: "20px",
    },
    orText: {
        fontSize: "18px",
        margin: "10px 0",
    },
    fileInput: {
        padding: "8px",
        fontSize: "16px",
        marginBottom: "15px",
    },
    input: {
        padding: "12px",
        width: "280px",
        fontSize: "16px",
        borderRadius: "8px",
        border: "1px solid #ccc",
        outline: "none",
        marginBottom: "15px",
    },
    verifyButton: {
        padding: "12px 20px",
        fontSize: "16px",
        backgroundColor: "#28a745",
        color: "white",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        transition: "0.3s",
    },
    resultContainer: {
        marginTop: "20px",
        padding: "10px",
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        borderRadius: "10px",
        width: "60%",
    },
};

export default App;
