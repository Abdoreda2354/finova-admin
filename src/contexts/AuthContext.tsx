import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface Admin {
  id: string;
  name: string;
  username: string;
  status: "active" | "disabled";
}

interface AuthContextType {
  admin: Admin | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  admins: Admin[];
  addAdmin: (name: string, username: string, password: string) => void;
  toggleAdminStatus: (id: string) => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

const initialAdmins: (Admin & { password: string })[] = [
  {
    id: "1",
    name: "Super Admin",
    username: "admin",
    password: "admin123",
    status: "active",
  },
];

export function AuthProvider({ children }: { children: ReactNode }) {

  // restore admin from localStorage
  const [admin, setAdmin] = useState<Admin | null>(() => {
    const savedAdmin = localStorage.getItem("admin");
    return savedAdmin ? JSON.parse(savedAdmin) : null;
  });

  const [adminsList, setAdminsList] = useState(initialAdmins);

  const login = (username: string, password: string) => {
    const found = adminsList.find(
      (a) =>
        a.username === username &&
        a.password === password &&
        a.status === "active"
    );

    if (found) {
      const loggedAdmin = {
        id: found.id,
        name: found.name,
        username: found.username,
        status: found.status,
      };

      setAdmin(loggedAdmin);

      // save to localStorage
      localStorage.setItem("admin", JSON.stringify(loggedAdmin));

      return true;
    }

    return false;
  };

  const logout = () => {
    setAdmin(null);

    // remove from localStorage
    localStorage.removeItem("admin");
  };

  const addAdmin = (name: string, username: string, password: string) => {
    setAdminsList((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name,
        username,
        password,
        status: "active",
      },
    ]);
  };

  const toggleAdminStatus = (id: string) => {
    setAdminsList((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              status: a.status === "active" ? "disabled" : "active",
            }
          : a
      )
    );
  };

  const admins: Admin[] = adminsList.map(({ password, ...rest }) => rest);

  return (
    <AuthContext.Provider
      value={{
        admin,
        login,
        logout,
        admins,
        addAdmin,
        toggleAdminStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);