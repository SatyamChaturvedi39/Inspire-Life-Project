import { 
  createContext, 
  useContext, 
  useState, 
  ReactNode, 
  useCallback 
} from "react";
import axios from "axios";
import { AuthContextType } from "./AuthTypes";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // By default, no user is logged in.
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  // Start with logged out state.
  const [isLoggedOut, setIsLoggedOut] = useState<boolean>(true);

  // Sets the auth state and marks the user as logged in.
  const setAuth = useCallback((token: string, userRole: string) => {
    setAccessToken(token);
    setRole(userRole);
    setIsLoggedOut(false);
  }, []);

  // Clears the auth state, marking the user as logged out.
  const clearAuth = useCallback(() => {
    setAccessToken(null);
    setRole(null);
    setIsLoggedOut(true);
  }, []);

  // This function attempts to refresh the access token, but only if the user is not logged out.
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
