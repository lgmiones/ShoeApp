import { createContext, useContext, useEffect, useState } from "react";
import { isAuthed, me, logout as doLogout, getRoles } from "../services/auth";

const AuthCtx = createContext(null);
export function AuthProvider({ children }) {
  const [ready, setReady] = useState(false);
  const [email, setEmail] = useState(localStorage.getItem("email") || "");
  const [roles, setRoles] = useState(getRoles());

  useEffect(() => {
    // try to refresh session on load (if token exists)
    (async () => {
      try {
        if (isAuthed()) {
          const info = await me();
          setEmail(info.email || "");
          setRoles(info.roles || []);
        }
      } catch {
        /* handled by axios */
      }
      setReady(true);
    })();
  }, []);

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
export function useAuth() {
  return useContext(AuthCtx);
}
