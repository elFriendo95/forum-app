import { useEffect, useState, type SubmitEvent } from "react";
import { useNavigate } from "react-router-dom";
import { api, ApiError } from "../lib/api";
import { useAuth } from "../contexts/AuthContext";
import type { Category, PostWithAuthor } from "../types/forum";

export function CreatePostPage() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [categoryId, setCategoryId] = useState<number | "">("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api<Category[]>("/categories")
      .then(setCategories)
      .catch((e) => {
        setError(
          e instanceof ApiError ? e.message : "Failed to load categories",
        );
      });
  }, []);

  async function onSubmit(e: SubmitEvent) {
    e.preventDefault();
    setError(null);

    if (categoryId === "") {
      setError("Please select a category");
      return;
    }

    setSubmitting(true);
    try {
      const created = await api<PostWithAuthor>("/posts", {
        method: "POST",
        body: JSON.stringify({
          title,
          body,
          categoryId: Number(categoryId),
        }),
      });
      navigate(`/posts/${created.id}`);
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) {
        logout();
        navigate("/login");
        return;
      }
      setError(e instanceof ApiError ? e.message : "Failed to create post");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page" style={{ maxWidth: 500, margin: "0 auto" }}>
      .<h1>New Post</h1>
      <form onSubmit={onSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label>
            Title
            <br />
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              minLength={3}
              maxLength={200}
              style={{ width: "100%" }}
            />
          </label>
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>
            Category
            <br />
            <select
              value={categoryId}
              onChange={(e) =>
                setCategoryId(
                  e.target.value === "" ? "" : Number(e.target.value),
                )
              }
              required
            >
              <option value="">Select a category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>
            Body
            <br />
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              required
              minLength={1}
              maxLength={5000}
              rows={10}
              style={{ width: "100%" }}
            />
          </label>
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit" disabled={submitting}>
          {submitting ? "Creating..." : "Create Post"}
        </button>
      </form>
    </div>
  );
}
