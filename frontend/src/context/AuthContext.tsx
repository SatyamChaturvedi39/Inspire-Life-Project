import { createContext, useContext, useState, ReactNode, useCallback, useRef } from "react";
import axios from "axios";
import { AuthContextType } from "./AuthTypes";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [isLoggedOut, setIsLoggedOut] = useState<boolean>(true);
  const sessionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const setAuth = useCallback((token: string, userRole: string, userName: string) => {
    console.log("[AuthContext] Setting auth:", { token, userRole, userName });

    setAccessToken(token);
    setRole(userRole);
    setName(userName);
    setIsLoggedOut(false);

    if (sessionTimeoutRef.current) {
      clearTimeout(sessionTimeoutRef.current);
    }

    sessionTimeoutRef.current = setTimeout(() => {
      alert("Your session has expired. Please login again.");
      clearAuth();
      window.location.href = "/login";
    }, 30 * 60 * 1000);
  }, []);

  const clearAuth = useCallback(() => {
    console.log("[AuthContext] Clearing auth");

    setAccessToken(null);
    setRole(null);
    setName(null);
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
      const response = await axios.get("http://localhost:5001/api/auth/refresh", {
        withCredentials: true,
      });
      if (response.data.accessToken) {
        setAccessToken(response.data.accessToken);
        console.log("[AuthContext] Access token refreshed");
      }
    } catch (error) {
      console.error("[AuthContext] Failed to refresh access token", error);
      clearAuth();
    }
  }, [clearAuth, isLoggedOut]);

  // 🔴 NEW: Debug Login Issue
  const login = async (email: string, password: string) => {
    try {
      console.log("🔹 Attempting login with:", { email, password });

      const response = await axios.post(
        "http://localhost:5001/api/auth/login",
        { email, password },
        { withCredentials: true }
      );

      console.log("✅ Login response:", response.data);

      if (response.data.accessToken) {
        setAuth(response.data.accessToken, response.data.role, response.data.name);
      } else {
        console.error("❌ Login failed: No access token received");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("❌ Login error:", error.response?.data || error.message);
      } else {
        console.error("❌ Login error:", error);
      }
      
    }
  };

  return (
    <AuthContext.Provider value={{ accessToken, role, name, setAuth, clearAuth, refreshAccessToken, login }}>
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
