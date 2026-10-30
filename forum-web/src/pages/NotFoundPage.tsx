import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <div style={{ padding: 24, textAlign: "center" }}>
      <h1 style={{ fontSize: 48, margin: 0 }}>404</h1>
      <p style={{ fontSize: 18, color: "#666" }}>
        The page you're looking for doesn't exist.
      </p>
      <Link to="/posts">← Back to posts</Link>
    </div>
  );
}
