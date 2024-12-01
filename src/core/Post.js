/* eslint-disable jsx-a11y/alt-text */
import React, { useState } from "react";
import AddPost from "./components/AddPost";
const Post = (props) => {
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState(null);

  const deletePost = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authorization token is missing");
      }

      const response = await fetch(`https://node-twitter-zrui.onrender.com/api/post/${props.postId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        redirect: "follow",
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message || "Failed to delete post");
      }

      const data = await response.json();
      setShowModal(false);
      props.refreshPosts();
    } catch (err) {
      console.error("Error deleting post:", err.message);
      alert(err.message);
    }
  };

  const openEditModal = () => {
    setEditData({
      title: props.title,
      content: props.content,
      media_urls: props.mediaUrls,
      tag_name: props.SMId,
    });
    setShowEditModal(true);
  };

  return (
    <div
      style={{
        borderRadius: "10px",
        backgroundColor: "white",
        padding: "10px 15px",
        margin: "0 0 10px 0",
      }}
    >
      {/* Header Section */}
      <div
        style={{
          display: "flex",
          justifyContent: "left",
          position: "relative",
        }}
      >
        <img
          src={props.imageUrl !== 'default_image_url' ? props.imageUrl : 'https://static.vecteezy.com/system/resources/previews/020/662/332/non_2x/earth-icon-logo-illustration-vector.jpg'}
          width="50px"
          height="50px"
          style={{
            borderRadius: "200px",
            marginRight: "5px",
            float: "left",
          }}
        />
        <div style={{
          display: "flex",
          flexDirection: "column",
        }}>
          <h4
            style={{
              color: "darkblue",
              fontSize: "1.2em",
              fontWeight: "bold",
              marginBottom: "0",
              float: "left",
            }}
          >
            {props.name}
          </h4>

          <h6
            style={{
              fontSize: ".7em",
              fontWeight: "bold",
              marginTop: "0",
              color: "rgba(0,0,0,0.3)",
            }}
          >
            {props.time}
          </h6>
        </div>
        {props.userId && (
        <i
          className="fa fa-trash"
          aria-hidden="true"
          style={{
            padding: "4px 4px",
            color: "#fa002f",
            position: "absolute",
            right: "5px",
            fontSize: "1.5em",
            cursor: "pointer",
          }}
          onClick={() => setShowModal(true)}
        ></i>
      )}

      {showModal && (
        <>
          {/* Background Overlay */}
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
              zIndex: 999, // Layer behind the modal
            }}
            onClick={() => setShowModal(false)} // Close modal when clicking on overlay
          ></div>

          {/* Modal */}
          <div
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 1000, // Layer above the overlay
              backgroundColor: "white",
              borderRadius: "10px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
              padding: "20px",
              width: "400px",
            }}
          >
            <h3>Are you sure you want to delete this post?</h3>
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "20px" }}>
              <button
                style={{
                  backgroundColor: "#ccc",
                  border: "none",
                  padding: "10px 15px",
                  marginRight: "10px",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                style={{
                  backgroundColor: "#fa002f",
                  color: "white",
                  border: "none",
                  padding: "10px 15px",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
                onClick={deletePost}
              >
                Yes
              </button>
            </div>
          </div>
        </>
      )}
      </div>

      {/* Content Section */}
      <div
        style={{
          display: "flex",
          justifyContent: "left",
          position: "relative",
        }}
      >
        <h5
          style={{
            marginTop: "5px",
            fontSize: "1em",
            fontWeight: "500",
            color: "rgba(0,0,0,0.7)",
            paddingRight: "20px",
            float: "left",
          }}
        >
          {props.content.split(/(https?:\/\/[^\s]+)/).map((part, index) =>
            part.match(/https?:\/\/[^\s]+/) ? (
              <a
                key={index}
                href={part}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#007BFF", // Highlight color for URL
                  textDecoration: "underline",
                }}
              >
                {part}
              </a>
            ) : (
              part
            )
          )}
        </h5>
        <i
          className="fa fa-angle-right"
          aria-hidden="true"
          style={{
            padding: "4px 4px",
            color: "rgba(0,0,0,0.5)",
            position: "absolute",
            right: "5px",
            fontSize: "1.5em",
          }}
        ></i>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <AddPost
          onClose={() => setShowEditModal(false)}
          formData={{
            postId: props.post._id,
            title: props.post.title,
            content: props.post.content,
            media_urls: props.post.media_urls,
            tag_name: props.post.tag_name,
            group_id: props.post.group_id,
            event_id: props.post.event_id,
            is_public: props.post.is_public,
          }}
        />
      )}

      {/* Media Section */}
      <div
        style={{
          marginTop: "10px",
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        {props.mediaUrls &&
          props.mediaUrls.map((url, index) => (
            <img
              key={index}
              src={url}
              alt={`Media ${index + 1}`}
              style={{
                maxWidth: "100%",
                height: "auto",
                borderRadius: "10px",
              }}
            />
          ))}
      </div>

      {/* Footer Section */}
      <div
        style={{
          display: "flex",
          justifyContent: "left",
          position: "relative",
          margin: "15px 8px 0 0",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "left",
            borderRadius: "15px",
            backgroundColor: "#e9e9e9",
            padding: "0 3px",
          }}
        >
          <h3
            style={{
              fontSize: "1em",
              margin: "8px 5px 0 0",
              padding: "4px 4px",
            }}
          >
            {props.SMId}
          </h3>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "left",
            position: "absolute",
            right: "0",
          }}
        >
          {props.userId && <button
            className="fa fa-pencil fa-lg"
            aria-hidden="true"
            style={{
              color: "#29b6f6",
              fontSize: "1.4em",
              borderRadius: "50%",
              width: "40px",
              height: "40px",
              marginRight: "10px",
              padding: "9px 11px",
              backgroundColor: "rgba(0,0,0,0.1)",
            }}
            onClick={openEditModal}
          ></button>}
        </div>
      </div>
    </div>
  );
};

export default Post;