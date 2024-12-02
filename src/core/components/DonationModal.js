import React, { useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { PeraWalletConnect } from "@perawallet/connect";

const peraWallet = new PeraWalletConnect();

const DonationModal = ({
  open,
  handleClose,
  projectName,
  walletAddress,
  exchangeRate,
}) => {
  const [donationAmount, setDonationAmount] = useState(0);
  const [usdEquivalent, setUsdEquivalent] = useState("");
  const [walletConnected, setWalletConnected] = useState(false);
  const [userAddress, setUserAddress] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (open) {
      setShowModal(true);
    } else {
      const timer = setTimeout(() => setShowModal(false), 300);
      return () => clearTimeout(timer);
    }
  }, [open]);

  const handleDonationChange = (e) => {
    const vndAmount = e.target.value.replace(/[,.]/g, "");
    setDonationAmount(vndAmount);
    if (vndAmount > 0 && exchangeRate) {
      setUsdEquivalent((vndAmount / exchangeRate).toFixed(6));
    } else {
      setUsdEquivalent("");
    }
  };

  const connectWallet = async () => {
    try {
      const accounts = await peraWallet.connect();
      peraWallet.connector?.on("disconnect", handleDisconnectWallet);
      setUserAddress(accounts[0]);
      setWalletConnected(true);
      alert(`Wallet connected: ${accounts[0]}`);
    } catch (error) {
      console.error("Error connecting to Pera Wallet:", error);
      alert("Failed to connect to wallet. Please try again.");
    }
  };

  const handleDisconnectWallet = () => {
    peraWallet.disconnect();
    setWalletConnected(false);
    setUserAddress(null);
  };

  const handleDonate = async () => {
    if (!walletConnected) {
      await connectWallet();
    }
    if (walletConnected && userAddress) {
      alert(`Initiating donation of ${usdEquivalent} ALGO from ${userAddress}`);
      // Here, you can add logic to process the transaction using the connected wallet.
    }
  };

  return (
    <>
      {showModal && (
        <>
          <div
            onClick={handleClose}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.6)",
              zIndex: 999,
            }}
          ></div>

          <div
            className={`modal-content ${open ? "open" : "close"}`}
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: "#fff",
              boxShadow: "0 8px 16px rgba(0, 0, 0, 0.3)",
              borderRadius: "12px",
              padding: "30px",
              zIndex: 1000,
              width: "450px",
              maxWidth: "90%",
              transition: "transform 0.3s ease, opacity 0.3s ease",
              opacity: open ? 1 : 0,
              transform: open
                ? "translate(-50%, -50%)"
                : "translate(-50%, -60%)",
            }}
          >
            <h2
              style={{
                textAlign: "center",
                color: "#333",
                marginBottom: "20px",
              }}
            >
              Support {projectName}
            </h2>
            <div
              style={{
                textAlign: "center",
                marginBottom: "20px",
                backgroundColor: "#f9f9f9",
                padding: "15px",
                borderRadius: "10px",
                boxShadow: "inset 0 2px 5px rgba(0, 0, 0, 0.1)",
              }}
            >
              <p
                style={{
                  marginBottom: "10px",
                  wordBreak: "break-word",
                  fontSize: "0.9rem",
                  color: "#555",
                }}
              >
                Wallet Address:
              </p>
              <p
                style={{
                  wordBreak: "break-word",
                  fontWeight: "bold",
                  color: "#333",
                  fontSize: "1rem",
                  marginBottom: "15px",
                }}
              >
                {walletAddress}
              </p>
              <QRCodeCanvas
                value={walletAddress}
                size={150}
                bgColor="#ffffff"
                fgColor="#000000"
              />
            </div>
            {/* <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "5px",
                  fontWeight: "bold",
                  fontSize: "0.9rem",
                  color: "#333",
                }}
              >
                Donation Amount (VND)
              </label>
              <input
                type="number"
                value={donationAmount}
                onChange={handleDonationChange}
                placeholder="Enter amount"
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                  outline: "none",
                  fontSize: "1rem",
                }}
              />
              {usdEquivalent && (
                <p
                  style={{
                    marginTop: "10px",
                    fontSize: "0.9rem",
                    color: "#555",
                  }}
                >
                  Equivalent: <strong>{usdEquivalent} ALGO</strong>
                </p>
              )}
            </div> */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "20px",
              }}
            >
              <button
                onClick={handleClose}
                style={{
                  padding: "10px 20px",
                  borderRadius: "8px",
                  border: "none",
                  backgroundColor: "#ccc",
                  color: "#333",
                  fontSize: "1rem",
                  cursor: "pointer",
                  transition: "background-color 0.3s",
                }}
                onMouseOver={(e) =>
                  (e.target.style.backgroundColor = "#bbb")
                }
                onMouseOut={(e) => (e.target.style.backgroundColor = "#ccc")}
              >
                Cancel
              </button>
              <button
                onClick={handleDonate}
                style={{
                  padding: "10px 20px",
                  borderRadius: "8px",
                  border: "none",
                  backgroundColor: "#0f52ba",
                  color: "#fff",
                  fontSize: "1rem",
                  cursor: "pointer",
                  transition: "background-color 0.3s",
                }}
                onMouseOver={(e) =>
                  (e.target.style.backgroundColor = "#0848a5")
                }
                onMouseOut={(e) => (e.target.style.backgroundColor = "#0f52ba")}
              >
                {walletConnected ? "Proceed to Donate" : "Connect Wallet"}
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default DonationModal;