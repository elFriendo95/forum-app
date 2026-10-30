import { Link } from "react-router-dom";

export function HomePage() {
  return (
    <div style={{ padding: 24 }}>
      <h1>Forum</h1>
      <p>
        <Link to="/posts">Browse Posts</Link>
      </p>
    </div>
  );
}
