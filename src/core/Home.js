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
  const history = useHistory();
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
          body: JSON.stringify({ email, password }),
        }
      );
  
      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.errors[0] || "Login failed");
      }
  
      const data = await response.json();
      localStorage.setItem("token", data.token);
  
      localStorage.setItem("user", JSON.stringify(data.user));
  
      console.log("Login successful:", data);
      return data;
    } catch (error) {
      console.error("Error during login:", error.message);
      throw error;
    }
  };

  const login = async () => {
    try {
      const result = await handleLogin(username, password);
      if(result) {
        history.push("/user/dashboard"); // Use history.push
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container-fluid">
      <div className="row" style={{ minHeight: "100vh" }}>
        <div className="col-md-5">
          <h3 style={{ fontWeight: "bold", color: '#008000' }}>
            Eco
            <span style={{ color: "#f9c901" }}>Hive</span>.
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
              Hey Eco Lovers 🌎
            </h1>
            <h6
              style={{
                fontWeight: "600",
                fontSize: "1em",
                marginBottom: "50px",
              }}
            >
              Welcome back to <span style={{ fontWeight: "bold", color: '#008000' }}>Eco</span>
              <span style={{ color: "#f9c901" }}>Hive</span>.
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
                  marginBottom: "20px",
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
                backgroundColor: "#008000",
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
          </div>
        </div>
        <div
          className="col-md-7"
          style={{
            backgroundColor: "#0f52ba",
            height: "100vh",
            padding: "0", 
          }}
        >
          <div
            className="video-container"
            style={{
              position: "relative",
              width: "100%",
              height: "100%",
              overflow: "hidden",
            }}
          >
            <video
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transform: "translate(-50%, -50%)",
              }}
              autoPlay
              muted
              loop
            >
              <source src={`/env.mp4`} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;