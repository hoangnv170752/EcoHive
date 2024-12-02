/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect, useState } from "react";
import fb from "../fb.png";
import PagesAndChannels from "./PagesAndChannels";
import Post from "./Post";
import { Link, useHistory } from "react-router-dom";
import AddPost from "./components/AddPost";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [users, setUsers] = useState([]);

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const history = useHistory();
  const [showAddPost, setShowAddPost] = useState(false);

  const fetchPosts = () => {
    getPosts();
  };

  const getPosts = async (page = 1, limit = 20) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("User is not authenticated");
      }

      const myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${token}`);

      const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };

      const response = await fetch(
        `https://node-twitter-zrui.onrender.com/api/allPosts?page=${page}&limit=${limit}`,
        requestOptions
      );

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message || "Failed to fetch posts");
      }

      const data = await response.json();
      console.log(data);
      setPosts(data.posts);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const getUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authorization token is missing");
      }

      const response = await fetch("https://node-twitter-zrui.onrender.com/api/users", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`, // Add the Bearer token
        },
        redirect: "follow",
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message || "Failed to fetch users");
      }

      const data = await response.json();
      setUsers(data.users || []); // Assuming the API returns users in `data.users`
    } catch (err) {
      console.error("Error fetching users:", err.message);
      setError(err.message);
    }
  };

  useEffect(() => {
    getPosts();
    getUsers();
  }, []);

  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [userData, setUserData] = useState({
    name: user?.name || "",
    date_of_birth: user?.date_of_birth || "",
    email: user?.email || "",
    username: user?.username || "",
    bio: user?.bio || "",
    location: user?.location || "",
    website: user?.website || "",
  });

  useEffect(() => {
    // Get token and user from localStorage
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
  
    if (storedToken) {
      setToken(storedToken);
    }
  
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser); // Parse the user JSON string
        console.log("Parsed user data:", parsedUser);
        setUser(parsedUser); // Set user state
        setUserData({
          name: parsedUser.name || "",
          date_of_birth: parsedUser.date_of_birth || "",
          email: parsedUser.email || "",
          username: parsedUser.username || "",
          bio: parsedUser.bio || "",
          location: parsedUser.location || "",
          website: parsedUser.website || "",
        });
      } catch (error) {
        console.error("Error parsing user data:", error.message);
      }
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  console.log("User data:", localStorage.getItem('user'));

  const handleUpdateUser = async () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${localStorage.getItem("token")}`);
  
    const requestOptions = {
      method: "PUT",
      headers: myHeaders,
      body: JSON.stringify(userData),
      redirect: "follow",
    };
  
    try {
      const response = await fetch(
        `https://node-twitter-zrui.onrender.com/api/user/${user._id}`,
        requestOptions
      );
  
      if (!response.ok) {
        throw new Error("Failed to update user");
      }
  
      const result = await response.json();
      console.log("User updated:", result);
  
      localStorage.removeItem("user");
      localStorage.setItem("user", JSON.stringify(result?.user));
      setUser(result);
      alert("User updated successfully!");

      window.location.reload();
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Failed to update user. Please try again.");
    }
  };
  return (
    <div className="container-fluid">
      <div className="row" style={{ paddingTop: "5px"}}>
        <div className="col-sm-3">
          <h3 style={{ fontWeight: "bold", color: '#008000' }}>
            Eco
            <span style={{ color: "#f9c901" }}>Hive</span>.
          </h3>
        </div>
        <div className="col-sm-5"></div>
        <div
          className="col-sm-2"
          style={{
            display: "flex",
            justifyContent: "left",
            alignItems: "center",
            marginBottom: "10px",
            padding: "0 15px",
          }}
        >
          <div>
      {/* Add Button */}
      <i
        className="fa fa-plus"
        aria-hidden="true"
        style={{
          color: "#0f52ba",
          fontSize: "1.5em",
          borderRadius: "200px",
          padding: "6px 8px",
          backgroundColor: "rgba(0,0,0,0.1)",
          marginRight: "30px",
          cursor: "pointer",
        }}
        onClick={() => setShowAddPost(true)} // Open modal on click
      ></i>

      {/* Modal for AddPost */}
      {showAddPost && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 1000,
            backgroundColor: "white",
            borderRadius: "10px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            padding: "20px",
            width: "400px",
          }}
        >
          {/* <AddPost
            token={localStorage.getItem("token")} // Pass token
            onClose={() => {
              setShowAddPost(false)
              fetchPosts()
            }}
          /> */}
          <AddPost
            token={localStorage.getItem('token')}
            onClose={() => setShowAddPost(false)}
            refreshPosts={fetchPosts}
          />
          <button
            onClick={() => {
              setShowAddPost(false)
              fetchPosts()
            }}
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              backgroundColor: "transparent",
              border: "none",
              fontSize: "1.2em",
              cursor: "pointer",
            }}
          >
            ×
          </button>
        </div>
      )}

      {/* Modal Background */}
      {showAddPost && (
        <div
          onClick={() => setShowAddPost(false)} // Close modal when clicking background
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 999,
          }}
        ></div>
      )}
    </div>
          <button
              onClick={() => {
                localStorage.clear();
                history.push("/");
              }}
              style={{
                backgroundColor: "transparent",
                border: "none",
                cursor: "pointer",
                color: "#999999",
                fontSize: "1em",
                display: "flex",
                alignItems: "center",
              }}
              title="Logout"
            >
              <i
                className="fa fa-sign-out"
                aria-hidden="true"
                style={{
                  fontSize: "1.5em",
                  marginRight: "5px",
                }}
              ></i>
              Logout
            </button>
        </div>
        <div className="col-sm-2" style={{ paddingLeft: "15px" }}>
          <img
            src={user?.avatar || "default_image_url"}
            width="40px"
            height="40px"
            style={{
              borderRadius: "200px",
              marginRight: "5px",
              float: "left",
            }}
          />
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <h6 style={{ color: "#999999", marginBottom: "0", float: "left" }}>
                Profile
              </h6>
              <i
                className="fa fa-angle-down"
                aria-hidden="true"
                style={{ marginLeft: "30px" }}
              ></i>
              <h4 style={{ fontWeight: "bold", fontSize: "1em", marginTop: "0" }} onClick={() => setShowUpdateModal(true)}>
                {user?.email}
              </h4>
            </div>
          </div>
        </div>

        {showUpdateModal && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 1000,
            backgroundColor: "white",
            borderRadius: "10px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            padding: "20px",
            width: "400px",
          }}
        >
          <h3 style={{ textAlign: "center" }}>Update your Ecofo</h3>
          <div style={{ marginBottom: "10px" }}>
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={userData.name}
              onChange={handleInputChange}
              style={{ width: "100%", padding: "5px", marginBottom: "10px" }}
            />
            <label>Date of Birth</label>
            <input
              type="date"
              name="date_of_birth"
              value={userData.date_of_birth}
              onChange={handleInputChange}
              style={{ width: "100%", padding: "5px", marginBottom: "10px" }}
            />
            <label>Username</label>
            <input
              type="text"
              name="username"
              value={userData.username}
              onChange={handleInputChange}
              style={{ width: "100%", padding: "5px", marginBottom: "10px" }}
            />
            <label>Bio</label>
            <textarea
              name="bio"
              value={userData.bio}
              onChange={handleInputChange}
              style={{ width: "100%", padding: "5px", marginBottom: "10px" }}
            />
          </div>
          <button
            onClick={handleUpdateUser}
            style={{
              backgroundColor: "#0f52ba",
              color: "white",
              padding: "10px 20px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              width: "100%",
            }}
          >
            Update
          </button>
          <button
            onClick={() => setShowUpdateModal(false)}
            style={{
              marginTop: "10px",
              backgroundColor: "transparent",
              border: "none",
              fontSize: "1.2em",
              cursor: "pointer",
              display: "block",
              width: "100%",
              color: "#999",
            }}
          >
            Cancel
          </button>
        </div>
      )}
      {showUpdateModal && (
        <div
          onClick={() => setShowUpdateModal(false)} 
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 999,
          }}
        ></div>
      )}
      </div>
      <div
        className="row"
        style={{
          backgroundColor: "#dfebee",
          minHeight: "100vh",
          display: "flex",
          gap: "20px",
          padding: "20px",
        }}
      >
        <div
          className="col-md-3"
          style={{
            flex: "0 0 25%", 
            maxWidth: "25%",
            backgroundColor: "white",
            borderRadius: "12px",
            padding: "20px",
            height: "auto",
          }}
        >
          <h1
            style={{
              fontWeight: "bold",
              fontSize: "1.5em",
              marginBottom: "20px",
              fontFamily: "'Helvetica Neue', Arial, sans-serif", // Add Facebook-like font family
            }}
          >
            Friends and Eco Partners
          </h1>
          <div>
            {users.map((user) => (
                <PagesAndChannels
                  checkStatus={user.verify === 1 ? true : false}
                  name={user.name}
                  image={fb}
                />
            ))}
          </div>
        </div>

        <div
          className="col-md-9"
          style={{
            flex: "1",
            display: "flex",
            flexDirection: "column", 
            gap: "20px", 
            alignItems: "center", 
            overflowY: "auto",
          }}
        >
          {posts.map((post) => (
            <div
              style={{
                width: "100%",
                maxWidth: "800px", 
                padding: "10px",
                boxSizing: "border-box",
                backgroundColor: "white",
                borderRadius: "12px",
              }}
              key={post._id}
            >
              <Post
                imageUrl={post.user.avatar || "default_image_url"}
                name={post.user.name || "Anonymous"}
                time={new Date(post.created_at).toLocaleString()}
                mediaUrls={post.media_urls || []}
                content={post.content}
                SMImage="default_sm_image_url"
                SMId={post.tag_name || "No Tag"}
                event_id={post.event_id || "No Wallet Attached"}
                userId={post.user._id === user._id}
                postId={post._id}
                post={post}
                refreshPosts={fetchPosts}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
