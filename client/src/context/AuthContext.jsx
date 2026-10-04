import { createContext, useContext, useState, useEffect } from "react";
import { apiRequest } from "../utils/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Initialize from localStorage so a page refresh doesn't log the user
  // out — tokens and the user object persist across sessions until they
  // explicitly log out or the token stops working.
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  function persistSession(newToken, newUser) {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(newUser));
  }

  function logout() {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }

  async function login(email, password) {
    const data = await apiRequest("/api/auth/login", {
      method: "POST",
      body: { email, password },
    });
    persistSession(data.token, data.user);
    return data;
  }

  async function register(email, password) {
    const data = await apiRequest("/api/auth/register", {
      method: "POST",
      body: { email, password },
    });
    persistSession(data.token, data.user);
    return data;
  }

  // Wraps apiRequest with the current token automatically, AND logs the
  // user out if the server ever responds 401 — covers cases like the
  // token expiring (1 hour, per the backend) or being invalidated
  // (tokenVersion bumped, account deactivated) since the user last
  // loaded the page.
  async function authedRequest(path, options = {}) {
    try {
      return await apiRequest(path, { ...options, token });
    } catch (err) {
      if (err.status === 401) {
        logout();
      }
      throw err;
    }
  }

  return (
    <AuthContext.Provider value={{ token, user, login, register, logout, authedRequest }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}