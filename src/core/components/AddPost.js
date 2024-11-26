import React, { useState, useEffect } from "react";

const AddPost = ({ token, onClose, refreshPosts, formData = null }) => {
  const [data, setData] = useState({
    title: "",
    content: "",
    media_urls: [""],
    tag_name: "",
    group_id: "",
    event_id: "",
    is_public: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const isEditMode = !!formData; // Determine if it's edit mode based on provided formData

  useEffect(() => {
    if (formData) {
      setData(formData); // Pre-fill form with data when editing
    }
  }, [formData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleMediaUrlChange = (index, value) => {
    const newMediaUrls = [...data.media_urls];
    newMediaUrls[index] = value;
    setData({ ...data, media_urls: newMediaUrls });
  };

  const addMediaUrlField = () => {
    setData({ ...data, media_urls: [...data.media_urls, ""] });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    setSuccessMessage("");

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${token}`);

    const endpoint = isEditMode
      ? `https://node-twitter-zrui.onrender.com/api/post/${formData.postId}`
      : "https://node-twitter-zrui.onrender.com/api/post";

    const method = isEditMode ? "PUT" : "POST";

    const requestOptions = {
      method,
      headers: myHeaders,
      body: JSON.stringify(data),
      redirect: "follow",
    };

    try {
      const response = await fetch(endpoint, requestOptions);

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message || "Failed to save post");
      }

      setSuccessMessage(
        isEditMode ? "Post updated successfully!" : "Post created successfully!"
      );
      refreshPosts(); // Refresh posts after submission
      onClose(); // Close the modal
    } catch (err) {
      console.error("Error:", err);
      setError("Failed to save post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Modal */}
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
        <h3>{isEditMode ? "Edit Post" : "Create Post"}</h3>

        {error && <p style={{ color: "red" }}>{error}</p>}
        {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}

        <input
          type="text"
          name="title"
          value={data.title}
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
          value={data.content}
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

        {data.media_urls.map((url, index) => (
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
          value={data.tag_name}
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

        <label>
          <input
            type="checkbox"
            name="is_public"
            checked={data.is_public}
            onChange={(e) => setData({ ...data, is_public: e.target.checked })}
          />
          Public
        </label>

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <button
            onClick={onClose}
            style={{
              padding: "10px",
              borderRadius: "5px",
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
              padding: "10px",
              borderRadius: "5px",
              backgroundColor: "#0f52ba",
              color: "white",
              cursor: "pointer",
            }}
            disabled={loading}
          >
            {loading ? "Saving..." : isEditMode ? "Update" : "Submit"}
          </button>
        </div>
      </div>

      {/* Modal Background */}
      <div
        onClick={onClose}
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
    </div>
  );
};

export default AddPost;