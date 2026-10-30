import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export function NavBar() {
  const { user, logout } = useAuth();
  return (
    <nav className="navbar">
      <Link to="/">Home</Link>
      <Link to="/posts">Posts</Link>
      {user && <Link to="/posts/new">New Post</Link>}
      <span style={{ flex: 1 }} />
      {user ? (
        <>
          <span>{user.username}</span>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </>
      )}
    </nav>
  );
}
