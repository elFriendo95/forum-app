import { useEffect, useState, type SubmitEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api, ApiError } from "../lib/api";
import { useAuth } from "../contexts/AuthContext";
import type {
  CommentWithAuthor,
  Paginated,
  PostWithAuthor,
} from "../types/forum";
import { NotFoundPage } from "./NotFoundPage";
import { ErrorBanner } from "../components/ErrorBanner";
import { Loading } from "../components/Loading";

export function PostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const postId = Number(id);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [post, setPost] = useState<PostWithAuthor | null>(null);
  const [comments, setComments] = useState<CommentWithAuthor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [commentBody, setCommentBody] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [actionError, setActionError] = useState<string | null>(null);
  // Load post and comments
  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);
        const [p, c] = await Promise.all([
          api<PostWithAuthor>(`/posts/${postId}`),
          api<Paginated<CommentWithAuthor>>(`/posts/${postId}/comments`),
        ]);
        if (!cancelled) {
          setPost(p);
          setComments(c.items);
        }
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
  }, [postId]);

  async function onAddComment(e: SubmitEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const created = await api<CommentWithAuthor>(
        `/posts/${postId}/comments`,
        {
          method: "POST",
          body: JSON.stringify({ body: commentBody }),
        },
      );
      setComments((prev) => [created, ...prev]);
      setCommentBody("");
    } catch (e) {
      setActionError(
        e instanceof ApiError ? e.message : "Failed to post comment",
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function onDeleteComment(commentId: number) {
    if (!confirm("Delete this comment?")) return;
    try {
      await api(`/comments/${commentId}`, { method: "DELETE" });
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch (e) {
      setActionError(e instanceof ApiError ? e.message : "Delete failed");
    }
  }

  async function onDeletePost() {
    if (!confirm("Delete this post?")) return;
    try {
      await api(`/posts/${postId}`, { method: "DELETE" });
      navigate("/posts");
    } catch (e) {
      setActionError(e instanceof ApiError ? e.message : "Delete failed");
    }
  }

  if (loading) return <Loading />;
  if (error) {
    if (error.includes("not found")) {
      return <NotFoundPage />;
    }
    return <p style={{ padding: 24, color: "red" }}>{error}</p>;
  }
  if (!post) return <p style={{ padding: 24 }}>Post not found.</p>;

  return (
    <div style={{ padding: 24 }}>
      <Link to="/posts">← Back to posts</Link>
      <h1>{post.title}</h1>
      <div style={{ color: "#666", marginBottom: 12 }}>
        by {post.author.username} in {post.category.name} —{" "}
        {new Date(post.createdAt).toLocaleString()}
      </div>
      <p style={{ whiteSpace: "pre-wrap", marginBottom: 24 }}>{post.body}</p>

      {user?.id === post.authorId && (
        <button onClick={onDeletePost} style={{ marginBottom: 24 }}>
          Delete post
        </button>
      )}
      {actionError && (
        <ErrorBanner
          message={actionError ?? ""}
          onDismiss={() => setActionError(null)}
        />
      )}
      <h2>Comments ({comments.length})</h2>

      {user ? (
        <form onSubmit={onAddComment} style={{ marginBottom: 24 }}>
          <textarea
            value={commentBody}
            onChange={(e) => setCommentBody(e.target.value)}
            required
            placeholder="Write a comment..."
            rows={3}
            style={{ width: "100%", marginBottom: 8 }}
          />
          <button type="submit" disabled={submitting || !commentBody.trim()}>
            {submitting ? "Posting..." : "Add comment"}
          </button>
        </form>
      ) : (
        <p>
          <Link to="/login">Log in</Link> to comment.
        </p>
      )}

      {comments.length === 0 && <p>No comments yet.</p>}
      <ul style={{ listStyle: "none", padding: 0 }}>
        {comments.map((c) => (
          <li key={c.id} style={{ borderTop: "1px solid #eee", padding: 12 }}>
            <div style={{ color: "#666", fontSize: 14 }}>
              {c.author?.username ?? "deleted user"}—{" "}
              {new Date(c.createdAt).toLocaleString()}
            </div>
            <p style={{ whiteSpace: "pre-wrap" }}>{c.body}</p>
            {user?.id === c.authorId && (
              <button onClick={() => onDeleteComment(c.id)}>Delete</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
