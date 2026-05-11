"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { User, Business, users } from "./data";

type RegisterData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  business: Business;
};

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => boolean;
  register: (data: RegisterData) => { ok: boolean; error?: string };
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => false,
  register: () => ({ ok: false }),
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  // In-memory registered users (persisted to localStorage for demo)
  const [registeredUsers, setRegisteredUsers] = useState<User[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("kasitrade_user");
    if (stored) setUser(JSON.parse(stored));
    const extra = localStorage.getItem("kasitrade_registered");
    if (extra) setRegisteredUsers(JSON.parse(extra));
  }, []);

  function login(email: string, password: string) {
    // Check seed users first, then registered users
    const found =
      users.find(u => u.email === email && u.password === password) ||
      registeredUsers.find(u => u.email === email && u.password === password);
    if (found) {
      setUser(found);
      localStorage.setItem("kasitrade_user", JSON.stringify(found));
      return true;
    }
    return false;
  }

  function register(data: RegisterData): { ok: boolean; error?: string } {
    const allUsers = [...users, ...registeredUsers];
    if (allUsers.find(u => u.email === data.email)) {
      return { ok: false, error: "An account with this email already exists." };
    }
    const newUser: User = {
      id: "u" + Date.now(),
      name: `${data.firstName} ${data.lastName}`,
      email: data.email,
      password: data.password,
      role: "entrepreneur",
      business: data.business,
      createdAt: new Date().toISOString().split("T")[0],
      lastLogin: new Date().toISOString().split("T")[0],
      loginDates: [new Date().toISOString().split("T")[0]],
    };
    const updated = [...registeredUsers, newUser];
    setRegisteredUsers(updated);
    localStorage.setItem("kasitrade_registered", JSON.stringify(updated));
    // Auto-login
    setUser(newUser);
    localStorage.setItem("kasitrade_user", JSON.stringify(newUser));
    return { ok: true };
  }

  function logout() {
    setUser(null);
    localStorage.removeItem("kasitrade_user");
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
