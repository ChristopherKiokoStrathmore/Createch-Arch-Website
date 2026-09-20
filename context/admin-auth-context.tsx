"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type AdminAuthCtx = {
  pin: string;
  loaded: boolean;
  authed: boolean;
  login: (pin: string) => void;
  signOut: () => Promise<void>;
  headers: () => HeadersInit;
};

const AdminAuthContext = createContext<AdminAuthCtx>({
  pin: "",
  loaded: false,
  authed: false,
  login: () => {},
  signOut: async () => {},
  headers: () => ({}),
});

const STORAGE_KEY = "admin_pin";

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [pin, setPin] = useState("");
  const [cookieAuthed, setCookieAuthed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem(STORAGE_KEY) ?? "";
    const frame = requestAnimationFrame(() => {
      if (stored) setPin(stored);
      else {
        fetch("/api/admin/session", { credentials: "include" })
          .then((res) => {
            if (res.ok) setCookieAuthed(true);
          })
          .catch(() => {
            /* locked */
          })
          .finally(() => setLoaded(true));
        return;
      }
      setLoaded(true);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  const login = useCallback((value: string) => {
    sessionStorage.setItem(STORAGE_KEY, value);
    setPin(value);
    setCookieAuthed(true);
  }, []);

  const signOut = useCallback(async () => {
    sessionStorage.removeItem(STORAGE_KEY);
    setPin("");
    setCookieAuthed(false);
    try {
      await fetch("/api/admin/session", {
        method: "DELETE",
        credentials: "include",
      });
    } catch {
      /* ignore */
    }
  }, []);

  const headers = useCallback((): HeadersInit => {
    return pin ? { "X-Admin-Key": pin } : {};
  }, [pin]);

  const value = useMemo(
    () => ({
      pin,
      loaded,
      authed: loaded && (pin.length > 0 || cookieAuthed),
      login,
      signOut,
      headers,
    }),
    [pin, loaded, cookieAuthed, login, signOut, headers],
  );

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  return useContext(AdminAuthContext);
}
