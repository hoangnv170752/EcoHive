import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import homePagePhoto from "../homePagePhoto.png";
import ConnectPhotos from "./ConnectPhotos";
import Features from "./Features";
import LoginInput from "./LoginInput";

const Home = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useHistory();

  // Handle login API call
  const handleLogin = async (email, password) => {
    try {
      const response = await fetch(
        "https://node-twitter-zrui.onrender.com/api/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }), // Ensure request body matches the required structure
        }
      );
  
      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.errors[0] || "Login failed");
      }
  
      const data = await response.json();
  
      // Save token to local storage
      localStorage.setItem("token", data.token);
  
      // Optional: Save user info
      localStorage.setItem("user", JSON.stringify(data.user));
  
      console.log("Login successful:", data);
      return data;
    } catch (error) {
      console.error("Error during login:", error.message);
      throw error;
    }
  };

  // Handle login button click
  const login = async () => {
    try {
      // const result = await handleLogin(username, password);
      alert("Login successful!", username, password);
      // Navigate to the dashboard after successful login
      navigate("/user/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container-fluid">
      <div className="row" style={{ minHeight: "100vh" }}>
        <div className="col-md-5">
          <h3 style={{ fontWeight: "bold" }}>
            Eco
            <span style={{ color: "#0f52ba" }}>Hive</span>.
          </h3>

          <div
            className="text-center"
            style={{ padding: "20px", maxWidth: "70%", margin: "10px auto" }}
          >
            <h1
              style={{
                fontWeight: "bold",
                marginTop: "20px",
                marginBottom: "10px",
                fontSize: "2.5em",
              }}
            >
              Hey there 👋
            </h1>
            <h6
              style={{
                fontWeight: "600",
                fontSize: "1em",
                marginBottom: "50px",
              }}
            >
              Welcome back to <span style={{ fontWeight: "bold" }}>Eco</span>
              <span style={{ color: "#0f52ba" }}>Hive</span>.
            </h6>

            <div>
              <LoginInput
                labelName="Username"
                inputType="text"
                placeholder="Enter Username..."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{
                  width: "100%",
                  height: "40px",
                  backgroundColor: "#dfebee",
                  padding: "10px",
                  borderRadius: "12px",
                  borderStyle: "none",
                  marginBottom: "20px",
                }}
              />
              <LoginInput
                labelName="Password"
                inputType="password"
                placeholder="Enter Password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: "100%",
                  height: "40px",
                  backgroundColor: "#dfebee",
                  padding: "10px",
                  borderRadius: "12px",
                  borderStyle: "none",
                }}
              />
            </div>

            {error && (
              <p style={{ color: "red", fontSize: "0.9em", marginBottom: "10px" }}>
                {error}
              </p>
            )}

            <button
              onClick={login}
              style={{
                borderRadius: "12px",
                backgroundColor: "#fa002f",
                width: "55%",
                color: "#dfebee",
                margin: "10px 0",
                boxShadow: "10px 10px 20px rgba(0, 0, 0, 0.4)",
                fontWeight: "500",
              }}
              className="btn"
            >
              Sign In
            </button>

            <h6>
              <Link
                to="/signup"
                style={{
                  textDecoration: "none",
                  color: "#999999",
                  fontSize: ".9em",
                }}
              >
                New User? <span style={{ color: "blue" }}>Signup instead</span>
              </Link>
            </h6>

            <p
              style={{
                color: "rgba(0, 0, 0, 0.7)",
                fontWeight: "400",
                marginTop: "20px",
              }}
            >
              Or continue with
            </p>

            <ConnectPhotos imageUrl="data:image/png;base64,..." />
            <ConnectPhotos imageUrl="data:image/png;base64,..." />
          </div>
        </div>
        <div className="col-md-7" style={{ backgroundColor: "#0f52ba" }}>
          <div className="text-center">
            <img src={homePagePhoto} style={{ marginTop: "100px" }} />
            <Features
              iconName="fa fa-comment"
              feature="Fully Automated Comment Moderation"
            />
            <Features
              iconName="fa fa-refresh"
              feature="Take a backseat while we automate your repo"
            />
            <Features
              iconName="fa fa-dollar"
              feature="Start with a free trial"
            />
            <Features
              iconName="fa fa-thumbs-up"
              feature="Best SAAS in the industry"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;