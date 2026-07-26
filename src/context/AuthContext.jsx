import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("opend_token") || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await api.get("/auth/me");
        setUser(res.data.user);
      } catch (err) {
        // token invalid/expired
        localStorage.removeItem("opend_token");
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    loadUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  async function register(username, email, password) {
    const res = await api.post("/auth/register", { username, email, password });
    localStorage.setItem("opend_token", res.data.token);
    setToken(res.data.token);
    setUser(res.data.user);
    return res.data.user;
  }

  async function login(email, password) {
    const res = await api.post("/auth/login", { email, password });
    localStorage.setItem("opend_token", res.data.token);
    setToken(res.data.token);
    setUser(res.data.user);
    return res.data.user;
  }

  function logout() {
    localStorage.removeItem("opend_token");
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
