import { createContext, useContext, useEffect, useState } from "react";
import { isAuthed, me, logout as doLogout, getRoles } from "../services/auth";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [ready, setReady] = useState(false);
  const [email, setEmail] = useState(localStorage.getItem("email") || "");
  const [roles, setRoles] = useState(getRoles());

  // 🔄 useEffect runs once when the app loads
  useEffect(() => {
    (async () => {
      try {
        if (isAuthed()) {
          const info = await me();
          setEmail(info.email || "");
          setRoles(info.roles || []);
        }
      } catch {}
      setReady(true);
    })();
  }, []);

  /**
   * 🧩 value object - This stores the authentication data and functions that
   * other components can access using the `useAuth()` hook.
   */
  const value = {
    ready,
    email,
    roles,
    isAdmin: roles.includes("Admin"),
    isAuthed: isAuthed(),
    logout: () => {
      doLogout();
      setEmail("");
      setRoles([]);
    },
  };

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

// 🎯 Custom hook for consuming authentication context easily
export function useAuth() {
  return useContext(AuthCtx);
}

//AuthContext.jsx is responsible for managing user login state and authentication across my entire React
