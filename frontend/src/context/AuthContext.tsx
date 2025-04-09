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
  // Initialize from localStorage if available
  const [accessToken, setAccessToken] = useState<string | null>(
    () => localStorage.getItem("accessToken")
  );
  const [role, setRole] = useState<string | null>(
    () => localStorage.getItem("role")
  );
  const [name, setName] = useState<string | null>(
    () => localStorage.getItem("name")
  );
  const [id, setId] = useState<string | null>(() => localStorage.getItem("id"));
  const [isLoggedOut, setIsLoggedOut] = useState<boolean>(!localStorage.getItem("accessToken"));
  const sessionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Keep isLoggedOut in sync with accessToken changes.
  useEffect(() => {
    setIsLoggedOut(!accessToken);
  }, [accessToken]);

  const setAuth = useCallback(
    (token: string, userRole: string, userName: string, userId: string) => {
      setAccessToken(token);
      setRole(userRole);
      setName(userName);
      setId(userId);
      localStorage.setItem("accessToken", token);
      localStorage.setItem("role", userRole);
      localStorage.setItem("name", userName);
      localStorage.setItem("id", userId);
      setIsLoggedOut(false);
      if (sessionTimeoutRef.current) {
        clearTimeout(sessionTimeoutRef.current);
      }
      // For testing: 30-minute timeout (adjust as needed)
      sessionTimeoutRef.current = setTimeout(() => {
        alert("Your session has expired. Please login again.");
        clearAuth();
        window.location.href = "/login";
      }, 30 * 60 * 1000);
    },
    []
  );

  const clearAuth = useCallback(() => {
    setAccessToken(null);
    setRole(null);
    setName(null);
    setId(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    localStorage.removeItem("id");
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
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/auth/refresh`, {
        withCredentials: true,
      });
      if (response.data.accessToken) {
        setAccessToken(response.data.accessToken);
        localStorage.setItem("accessToken", response.data.accessToken);
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
