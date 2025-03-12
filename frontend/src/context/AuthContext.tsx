import {createContext,useContext,useState,ReactNode,useCallback,useRef} from "react";
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
    setAccessToken(token);
    setRole(userRole);
    setName(userName);
    setIsLoggedOut(false);
    if (sessionTimeoutRef.current) {
      clearTimeout(sessionTimeoutRef.current);
    }
    // For testing, you may set this to a lower value (e.g., 30 seconds) then later change to 30 minutes.
    sessionTimeoutRef.current = setTimeout(() => {
      alert("Your session has expired. Please login again.");
      clearAuth();
      window.location.href = "/login";
    }, 30 * 60 * 1000);
  }, []);

  const clearAuth = useCallback(() => {
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

  return (
    <AuthContext.Provider value={{ accessToken, role, name, setAuth, clearAuth, refreshAccessToken }}>
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