
import React, { useState, useMemo } from "react";

const Post = React.memo(({ post }) => {
  const [verified, setVerified] = useState(post.verifyPost);

  const randomBackground = useMemo(() => {
    const colors = ["#FFC0CB", "#FFD700", "#90EE90", "#87CEEB", "#FFA07A"];
    return colors[Math.floor(Math.random() * colors.length)];
  }, []);

  return (
    <div
      style={{
        backgroundColor: randomBackground,
        padding: "15px",
        margin: "10px 0",
        borderRadius: "8px",
      }}
    >
      <h4>{post.title}</h4>
      <p>{post.body}</p>
      <p>
        Status:{" "}
        <strong>{verified ? "✅ Verified" : "❌ Not Verified"}</strong>
      </p>
      <button onClick={() => setVerified((prev) => !prev)}>
        {verified ? "Unverify" : "Verify"}
      </button>
    </div>
  );
});

export default Post;
