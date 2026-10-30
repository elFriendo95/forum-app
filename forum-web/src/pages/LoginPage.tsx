import { useState, type SubmitEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { ApiError } from "../lib/api";

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  async function onSubmit(e: SubmitEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login({ email, password });
      navigate("/posts");
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }
  return (
    <div className="page" style={{ maxWidth: 500, margin: "0 auto" }}>
      .<h1>Login</h1>
      <form onSubmit={onSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label>
            Email
            <br />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: "100%" }}
            />
          </label>
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>
            Password
            <br />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: "100%" }}
            />
          </label>
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit" disabled={submitting}>
          {submitting ? "Logging in ..." : "Login"}
        </button>
      </form>
      <p>
        No account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}
