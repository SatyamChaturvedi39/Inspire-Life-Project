import{createContext,useContext,useState,ReactNode,useEffect,useCallback,} from "react";
import axios from "axios";
import { AuthContextType } from "./AuthTypes";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  // New state to flag that the user has explicitly logged out.
  const [isLoggedOut, setIsLoggedOut] = useState<boolean>(false);

  const setAuth = useCallback((token: string, userRole: string) => {
    setAccessToken(token);
    setRole(userRole);
    setIsLoggedOut(false); // Reset the flag when a new token is set.
  }, []);

  const clearAuth = useCallback(() => {
    setAccessToken(null);
    setRole(null);
    setIsLoggedOut(true);
  }, []);

  const refreshAccessToken = useCallback(async () => {
    // Only refresh if user hasn't explicitly logged out.
    if (isLoggedOut) {
      console.log("[AuthContext] Skipping refresh because user is logged out.");
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

  useEffect(() => {
    // Only attempt to refresh if user is not logged out.
    if (!isLoggedOut) {
      refreshAccessToken();
    }
  }, [refreshAccessToken, isLoggedOut]);

  return (
    <AuthContext.Provider value={{ accessToken, role, setAuth, clearAuth, refreshAccessToken }}>
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
