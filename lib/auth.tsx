"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { User, users } from "./data";

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => false,
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("kasitrade_user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  function login(email: string, password: string) {
    const found = users.find((u) => u.email === email && u.password === password);
    if (found) {
      setUser(found);
      localStorage.setItem("kasitrade_user", JSON.stringify(found));
      return true;
    }
    return false;
  }

  function logout() {
    setUser(null);
    localStorage.removeItem("kasitrade_user");
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
