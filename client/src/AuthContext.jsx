import React, { createContext, useContext, useState, useEffect } from "react";
import api, { setAuthHeader } from "./api/axiosInstance";

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, _setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Init from localStorage
  useEffect(() => {
    let mounted = true;

    try {
      const rawUser = localStorage.getItem("user");
      const rawToken = localStorage.getItem("authToken");

      if (rawUser && mounted) {
        try {
          _setUser(JSON.parse(rawUser));
        } catch {
          localStorage.removeItem("user");
        }
      }

      if (rawToken && mounted) {
        setToken(rawToken);
      }
    } catch (err) {
      console.error("Auth init error:", err);
    } finally {
      if (mounted) setLoading(false);
    }

    return () => {
      mounted = false;
    };
  }, []);

  // Sync axios auth header
  useEffect(() => {
    setAuthHeader(token);
  }, [token]);

  // Centralized setter (updates state + localStorage)
  const setUser = (userData) => {
    _setUser(userData || null);
    if (userData) {
      localStorage.setItem("user", JSON.stringify(userData));
    } else {
      localStorage.removeItem("user");
    }
  };

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    if (authToken) {
      localStorage.setItem("authToken", authToken);
    } else {
      localStorage.removeItem("authToken");
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("authToken");
  };

  // 🔥 IMPORTANT: refresh user from backend (points, badges, etc.)
  const refreshUser = async () => {
    try {
      const res = await api.get("/api/auth/me");
      setUser(res.data.user);
    } catch (err) {
      console.error("Failed to refresh user", err);
    }
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token,
    setUser,
    refreshUser, // 👈 exposed
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
};
