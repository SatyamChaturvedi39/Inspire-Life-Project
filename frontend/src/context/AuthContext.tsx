// src/context/AuthContext.tsx
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
  useRef,
  useEffect,
} from "react";
import axios from "axios";
import { AuthContextType } from "./AuthTypes";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Initialize everything as null (no persistent storage)
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [id, setId] = useState<string | null>(null);
  const [isLoggedOut, setIsLoggedOut] = useState<boolean>(true);
  const sessionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setIsLoggedOut(!accessToken);
  }, [accessToken]);

  const setAuth = useCallback(
    (token: string, userRole: string, userName: string, userId: string) => {
      setAccessToken(token);
      setRole(userRole);
      setName(userName);
      setId(userId);
      setIsLoggedOut(false);
      if (sessionTimeoutRef.current) {
        clearTimeout(sessionTimeoutRef.current);
      }
      // Set a 30-minute auto-logout timeout
      sessionTimeoutRef.current = setTimeout(() => {
        alert("Your session has expired. Please login again.");
        clearAuth();
        window.location.href = "/login";
      }, 30 * 60 * 1000);
    },
    []
  );

  const clearAuth = useCallback(async () => {
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/logout`, {}, { withCredentials: true });
    } catch (error) {
      console.error("Logout endpoint error:", error);
    }

    setAccessToken(null);
    setRole(null);
    setName(null);
    setId(null);
    setIsLoggedOut(true);
    if (sessionTimeoutRef.current) {
      clearTimeout(sessionTimeoutRef.current);
      sessionTimeoutRef.current = null;
    }
  }, []);

  const refreshAccessToken = useCallback(async () => {
    if (isLoggedOut) {
      console.log("[AuthContext] User is logged out. Skipping token refresh.");
      return;
    }
    try {
      // The refresh endpoint uses the HTTP-only cookie to generate a new access token.
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/refresh`,
        { withCredentials: true }
      );
      if (response.data.accessToken) {
        setAccessToken(response.data.accessToken);
        console.log("[AuthContext] Access token refreshed");
      }
    } catch (error) {
      console.error("[AuthContext] Failed to refresh access token", error);
      clearAuth();
    }
  }, [clearAuth, isLoggedOut]);

  return (
    <AuthContext.Provider
      value={{ accessToken, role, name, id, setAuth, clearAuth, refreshAccessToken }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
