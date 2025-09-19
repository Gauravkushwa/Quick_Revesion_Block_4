
import React, { useState, useEffect, useCallback } from "react";
import Post from "./Post";

export default function App() {
  const [timer, setTimer] = useState(0);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const addPost = useCallback(() => {
    if (!title.trim() || !body.trim()) return;
    setPosts((prevPosts) => [
      ...prevPosts,
      {
        id: Date.now(),
        title,
        body,
        verifyPost: false,
      },
    ]);
    setTitle("");
    setBody("");
  }, [title, body]);

  return (
    <div style={{ padding: "20px" }}>
      <h2>⏱ Timer: {timer}</h2>

      <input
        type="text"
        placeholder="Enter Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <br />
      <input
        type="text"
        placeholder="Enter Body"
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />
      <br />
      <button onClick={addPost}>Add Post</button>

      <h3>Posts:</h3>
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  );
}
