import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem("users");
    try {
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [currentUserId, setCurrentUserId] = useState(() => {
    return localStorage.getItem("currentUserId") || null;
  });

  const currentUser = useMemo(
    () => users.find((u) => u.id === currentUserId) || null,
    [users, currentUserId]
  );

  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUserId) {
      localStorage.setItem("currentUserId", currentUserId);
    } else {
      localStorage.removeItem("currentUserId");
    }
  }, [currentUserId]);

  const signup = ({ name, email, password, dob }) => {
    const existing = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );
    if (existing) {
      throw new Error("An account with this email already exists.");
    }

    const newUser = {
      id: String(Date.now()),
      name,
      email,
      password,
      createdAt: new Date().toISOString(),
      dob: dob || null,
    };

    setUsers((prev) => [...prev, newUser]);
    setCurrentUserId(newUser.id);
    return newUser;
  };

  const login = ({ email, password }) => {
    const user = users.find(
      (u) =>
        u.email.toLowerCase() === email.toLowerCase() &&
        u.password === password
    );
    if (!user) {
      throw new Error("Invalid email or password.");
    }
    setCurrentUserId(user.id);
    return user;
  };

  const logout = () => {
    setCurrentUserId(null);
  };

  const updateProfile = ({ name, email, dob, password }) => {
    if (!currentUserId || !currentUser) return;

    setUsers((prev) => {
      return prev.map((u) => {
        if (u.id !== currentUserId) return u;

        const updated = { ...u };

        if (email && email.toLowerCase() !== u.email.toLowerCase()) {
          const exists = prev.find(
            (other) =>
              other.id !== currentUserId &&
              other.email.toLowerCase() === email.toLowerCase()
          );
          if (exists) {
            throw new Error("Another account already uses this email.");
          }
          updated.email = email;
        }

        if (name !== undefined) {
          updated.name = name;
        }
        if (dob !== undefined) {
          updated.dob = dob;
        }
        if (password) {
          updated.password = password;
        }

        return updated;
      });
    });
  };

  const value = {
    users,
    currentUser,
    currentUserId,
    signup,
    login,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}

