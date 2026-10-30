import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { api, ApiError } from "../lib/api";
import { useAuth } from "../contexts/AuthContext";
import type { PaginatedPosts, PostWithAuthor, Category } from "../types/forum";
import { ErrorBanner } from "../components/ErrorBanner";
import { Loading } from "../components/Loading";

export function PostListPage() {
  const { user, logout } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [posts, setPosts] = useState<PostWithAuthor[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const categoryId = searchParams.get("categoryId") ?? "";
  const search = searchParams.get("search") ?? "";

  const [deleteError, setDeleteError] = useState<string | null>(null);
  useEffect(() => {
    api<Category[]>("/categories")
      .then((categories) => setCategories(categories))
      .catch(() => {});
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        setError(null);
        const qs = new URLSearchParams();

        if (categoryId) qs.set("categoryId", categoryId);
        if (search) qs.set("search", search);

        const data = await api<PaginatedPosts>(`/posts?${qs.toString()}`);
        if (!cancelled) setPosts(data.items);
      } catch (e) {
        if (!cancelled) {
          if (e instanceof ApiError && e.status === 401) {
            logout();
            return;
          }
          setError(e instanceof ApiError ? e.message : "Failed to load");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [categoryId, search]);

  async function onDelete(id: number) {
    if (!confirm("Delete this post?")) return;
    try {
      await api(`/posts/${id}`, { method: "DELETE" });
      setPosts((prev) => prev.filter((p) => p.id !== id));
    } catch (e) {
      setDeleteError(e instanceof ApiError ? e.message : "Delete failed");
    }
  }
  function updateFilter(key: string, value: string) {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    setSearchParams(next);
  }

  return (
    <div className="page">
      <h1>Posts</h1>

      <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
        <select
          value={categoryId}
          onChange={(e) => updateFilter("categoryId", e.target.value)}
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <input
          placeholder="Search titles..."
          value={search}
          onChange={(e) => updateFilter("search", e.target.value)}
        />
      </div>

      {loading && <Loading />}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && !error && posts.length === 0 && <p>No posts yet.</p>}
      {deleteError && (
        <ErrorBanner
          message={deleteError}
          onDismiss={() => setDeleteError(null)}
        />
      )}
      <ul className="post-list">
        {posts.map((p) => (
          <li key={p.id} className="post-item">
            <Link to={`/posts/${p.id}`} style={{ fontSize: 18 }}>
              {p.title}
            </Link>
            <div className="post-meta">
              by {p.author?.username ?? "deleted user"} in{" "}
              {p.category?.name ?? "unknown"}—{" "}
              {new Date(p.createdAt).toLocaleString()}
            </div>
            <p style={{ margin: "8px 0" }}>{p.body.slice(0, 200)}...</p>
            {user?.id === p.authorId && (
              <button onClick={() => onDelete(p.id)}>Delete</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
