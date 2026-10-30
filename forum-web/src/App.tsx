import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { NavBar } from "./components/NavBar";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { PostListPage } from "./pages/PostListPage";
import { PostDetailPage } from "./pages/PostDetailPage";
import { CreatePostPage } from "./pages/CreatePostPage";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { NotFoundPage } from "./pages/NotFoundPage";
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/posts" element={<PostListPage />} />
          <Route
            path="/posts/new"
            element={
              <ProtectedRoute>
                <CreatePostPage />
              </ProtectedRoute>
            }
          />
          <Route path="/posts/:id" element={<PostDetailPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
