import React, { useState } from "react";

const AddPost = ({token}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    media_urls: [""],
    tag_name: "",
    group_id: "",
    event_id: "",
    is_public: true,
  });

  const refreshPosts = () => {
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
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleMediaUrlChange = (index, value) => {
    const newMediaUrls = [...formData.media_urls];
    newMediaUrls[index] = value;
    setFormData({
      ...formData,
      media_urls: newMediaUrls,
    });
  };

  const addMediaUrlField = () => {
    setFormData({
      ...formData,
      media_urls: [...formData.media_urls, ""],
    });
  };

  const handleSubmit = () => {
    setLoading(true);
    setError("");
    setSuccessMessage("");

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${token}`);

    const raw = JSON.stringify(formData);

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch("https://node-twitter-zrui.onrender.com/api/post", requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to create post");
        }
        return response.text();
      })
      .then((result) => {
        console.log("Post Created:", result);
        setSuccessMessage("Post created successfully!");
        setFormData({
          title: "",
          content: "",
          media_urls: [""],
          tag_name: "",
          group_id: "",
          event_id: "",
          is_public: true,
        });
        setIsModalOpen(false);
        refreshPosts();
      })
      .catch((error) => {
        console.error("Error:", error);
        setError("Failed to create post. Please try again.");
      })
      .finally(() => setLoading(false));
  };

  return (
    <div>
      {/* Add Post Button */}
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
        onClick={() => setIsModalOpen(true)}
      ></i>

      {/* Modal */}
      {isModalOpen && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            borderRadius: "10px",
            padding: "20px",
            zIndex: 1000,
            width: "400px",
          }}
        >
          <h3 style={{ marginBottom: "10px" }}>Share your journey on green planet</h3>

          {error && (
            <p style={{ color: "red", marginBottom: "10px" }}>{error}</p>
          )}
          {successMessage && (
            <p style={{ color: "green", marginBottom: "10px" }}>
              {successMessage}
            </p>
          )}

          <input
            type="text"
            name="title"
            value={formData.title}
            placeholder="Post Title"
            onChange={handleInputChange}
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />

          <textarea
            name="content"
            value={formData.content}
            placeholder="Post Content"
            onChange={handleInputChange}
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
            rows="4"
          ></textarea>

          {formData.media_urls.map((url, index) => (
            <div key={index} style={{ marginBottom: "10px" }}>
              <input
                type="text"
                placeholder={`Media URL ${index + 1}`}
                value={url}
                onChange={(e) => handleMediaUrlChange(index, e.target.value)}
                style={{
                  width: "85%",
                  padding: "8px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                }}
              />
              <button
                type="button"
                onClick={addMediaUrlField}
                style={{
                  marginLeft: "5px",
                  padding: "5px",
                  borderRadius: "5px",
                  border: "none",
                  backgroundColor: "#0f52ba",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                +
              </button>
            </div>
          ))}

          <input
            type="text"
            name="tag_name"
            value={formData.tag_name}
            placeholder="Tag Name"
            onChange={handleInputChange}
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />


          {/* Public Checkbox */}
          <label style={{ marginBottom: "10px", display: "block" }}>
            <input
              type="checkbox"
              name="is_public"
              checked={formData.is_public}
              onChange={(e) =>
                setFormData({ ...formData, is_public: e.target.checked })
              }
              style={{ marginRight: "5px" }}
            />
            Public
          </label>

          {/* Buttons */}
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <button
              onClick={() => setIsModalOpen(false)}
              style={{
                padding: "10px 15px",
                borderRadius: "5px",
                border: "none",
                backgroundColor: "#ccc",
                cursor: "pointer",
              }}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              style={{
                padding: "10px 15px",
                borderRadius: "5px",
                border: "none",
                backgroundColor: "#0f52ba",
                color: "white",
                cursor: "pointer",
              }}
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div
          onClick={() => setIsModalOpen(false)}
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 999,
          }}
        ></div>
      )}
    </div>
  );
};

export default AddPost;