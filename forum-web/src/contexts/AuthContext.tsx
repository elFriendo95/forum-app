import {
  useContext,
  createContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import type {
  PublicUser,
  RegisterDto,
  AuthResponse,
  LoginDto,
} from "../types/forum";
import { api } from "../lib/api";
interface AuthContextValue {
  user: PublicUser | null;
  token: string | null;
  loading: boolean;
  login: (dto: LoginDto) => Promise<void>;
  register: (dto: RegisterDto) => Promise<void>;
  logout: () => void;
}
const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<PublicUser | null>(null);
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("token"),
  );
  const [loading, setLoading] = useState(() => !!localStorage.getItem("token"));

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    api<PublicUser>("/auth/me")
      .then((u) => {
        if (!cancelled) setUser(u);
      })
      .catch(() => {
        if (!cancelled) {
          setToken(null);
          localStorage.removeItem("token");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
  }, []);
  function applyAuth(res: AuthResponse) {
    localStorage.setItem("token", res.token);
    setToken(res.token);
    setUser(res.user);
  }
  async function login(dto: LoginDto) {
    const res = await api<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(dto),
    });
    applyAuth(res);
  }
  async function register(dto: RegisterDto) {
    const res = await api<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(dto),
    });
    applyAuth(res);
  }
  function logout() {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
  }
  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
