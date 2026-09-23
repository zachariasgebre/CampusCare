import { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);

const SESSION_KEY = "campuscare-session";

function readSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readSession());

  const value = useMemo(
    () => ({
      user,
      login: (profile) => {
        const next = {
          name: profile.name.trim(),
          phone: profile.phone.trim(),
          studentId: profile.studentId.trim(),
        };
        localStorage.setItem(SESSION_KEY, JSON.stringify(next));
        setUser(next);
      },
      logout: () => {
        localStorage.removeItem(SESSION_KEY);
        setUser(null);
      },
    }),
    [user]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);

  if (ctx === null) {
    throw new Error("useAuth must be used inside an AuthProvider");
  }

  return ctx;
}
