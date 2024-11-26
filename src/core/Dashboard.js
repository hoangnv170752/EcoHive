import React, { useEffect, useState } from "react";
import instagram from "../instagram.png";
import fb from "../fb.png";
import youtube from "../youtube.png";
import PagesAndChannels from "./PagesAndChannels";
import Status from "./Status";
import PlanUsage from "./PlanUsage";
import Post from "./Post";
import PostCountBox from "./PostCountBox";
import { Link, useHistory } from "react-router-dom";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const history = useHistory();

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

  useEffect(() => {
    getPosts(); // Fetch posts when the component mounts
  }, []);

  useEffect(() => {
    // Get token and user from localStorage
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken) {
      setToken(storedToken);
    }

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser)); // Parse the user JSON string
      } catch (error) {
        console.error("Error parsing user data:", error.message);
      }
    }
  }, []);
  return (
    <div className="container-fluid">
      <div className="row" style={{ paddingTop: "5px" }}>
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
          <i
            className="fa fa-address-book-o"
            aria-hidden="true"
            style={{
              color: "#0f52ba",
              fontSize: "1.5em",
              borderRadius: "200px",
              padding: "6px 8px",
              marginRight: "10px",
              backgroundColor: "rgba(0,0,0,0.1)",
            }}
          ></i>
          <i
            className="fa fa-cog"
            aria-hidden="true"
            style={{
              color: "#0f52ba",
              fontSize: "1.5em",
              borderRadius: "200px",
              padding: "6px 8px",
              backgroundColor: "rgba(0,0,0,0.1)",
            }}
          ></i>
        </div>
        <div className="col-sm-2" style={{ paddingLeft: "15px" }}>
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRA0qxFQtZdfcfi9AasqcWO1YadB3wPXpowiQ&usqp=CAU"
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
              <h4 style={{ fontWeight: "bold", fontSize: "1em", marginTop: "0" }}>
                {user?.email}
              </h4>
            </div>
            <button
              onClick={() => {
                localStorage.clear(); // Clear user and token from localStorage
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
        </div>
      </div>
      <div
        className="row"
        style={{
          backgroundColor: "#dfebee",
          minHeight: "100vh",
        }}
      >
        <div
          className="col-md-3"
          style={{
            padding: "10px 30px",
          }}
        >
          <div
            style={{
              borderRadius: "12px",
              backgroundColor: "white",
              padding: "20px 30px 20px 15px",
            }}
          >
            <h1
              style={{
                fontWeight: "bold",
                fontSize: "1.5em",
                marginBottom: "20px",
              }}
            >
              Friends and Eco Partners
            </h1>
            <div>
              <PagesAndChannels
                checkStatus={true}
                name="Rachana Ranade"
                image={youtube}
              />
              <PagesAndChannels
                checkStatus={true}
                name="Rachana.ranade3"
                image={instagram}
              />
              <PagesAndChannels
                checkStatus={false}
                name="Rachana Ranade"
                image={fb}
              />
              <PagesAndChannels
                checkStatus={true}
                name="Rachana Ranade"
                image={instagram}
              />
            </div>
          </div>
        </div>
        {posts.map((post) => (
          <div
            className="col-md-6"
            style={{ padding: "10px 30px 10px 10px" }}
            key={post._id}
          >
            <Post
              imageUrl={post.media_urls?.[0] || "default_image_url"}
              name={post.user_id || "Anonymous"}
              time={new Date(post.created_at).toLocaleString()}
              content={post.content}
              SMImage="default_sm_image_url"
              SMId={post.tag_name || "No Tag"}
            />
          </div>
        ))}
        {/* <div className="col-md-3">
          <div
            style={{
              borderRadius: "10px",
              backgroundColor: "white",
              padding: "10px 15px",
              margin: "10px 0 0 0",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "left",
              }}
            >
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRA0qxFQtZdfcfi9AasqcWO1YadB3wPXpowiQ&usqp=CAU"
                width="50px"
                height="50px"
                style={{
                  borderRadius: "200px",
                  marginRight: "5px",
                  float: "left",
                }}
              />
              <div>
                <h4
                  style={{
                    color: "darkblue",
                    fontSize: "1.2em",
                    fontWeight: "bold",
                    marginBottom: "0",
                    float: "left",
                  }}
                >
                  Rachana Ranade
                </h4>

                <h6
                  style={{
                    fontSize: ".7em",
                    fontWeight: "bold",
                    marginTop: "0",
                    color: "rgba(0,0,0,0.3)",
                  }}
                >
                  2:30 PM Today
                </h6>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                marginTop: "10px",
                padding: "0 3px",
                position: "relative",
                opacity: "0.5",
              }}
            >
              <div
                style={{
                  float: "left",
                  marginRight: "5px",
                  borderRadius: "8px",
                  backgroundColor: "#e9e9e9",
                  padding: "0 5px",
                }}
              >
                <h3
                  style={{
                    fontSize: ".9em",
                    margin: "3px 5px 0 0",
                    color: "blue",
                    float: "left",
                  }}
                >
                  Like
                </h3>
                <i
                  className="fa fa-thumbs-up"
                  aria-hidden="true"
                  style={{
                    fontSize: ".8em",
                    color: "blue",
                    marginTop: "8px",
                  }}
                ></i>
              </div>
              <div
                style={{
                  borderRadius: "8px",
                  backgroundColor: "#e9e9e9",
                  padding: "0 5px",
                }}
              >
                <h3
                  style={{
                    fontSize: ".9em",
                    margin: "3px 5px 0 0",
                    color: "red",
                    float: "left",
                  }}
                >
                  Ban
                </h3>
                <i
                  className="fa fa-ban"
                  aria-hidden="true"
                  style={{
                    fontSize: ".8em",
                    color: "red",
                    marginTop: "8px",
                  }}
                ></i>
              </div>
              <button
                className="btn btn-success"
                style={{
                  width: "20%",
                  height: "auto",
                  padding: "0",
                  margin: "0",
                  fontSize: ".8em",
                  position: "absolute",
                  right: "0",
                }}
              >
                Reply
              </button>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default Dashboard;
