// context/AuthContext.jsx
"use client";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = () => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("user");
        localStorage.removeItem("userToken"); // ← renamed key
        setUser(null);
      }
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    loadUser();
    setLoading(false);
  }, []);

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "user" || e.key === null) loadUser();
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

const login = (userData, token) => {
  localStorage.setItem("user_token", token);   // ← was "token"
  localStorage.setItem("user", JSON.stringify(userData));
  setUser(userData);
};

const logout = () => {
  localStorage.removeItem("user_token");        // ← was "token"
  localStorage.removeItem("user");
  setUser(null);
};

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);