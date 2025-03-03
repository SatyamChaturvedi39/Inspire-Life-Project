// src/context/AuthContext.tsx
import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from "react";
import axios from "axios";
import { AuthContextType } from "./AuthTypes";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  const setAuth = useCallback((token: string, userRole: string) => {
    setAccessToken(token);
    setRole(userRole);
  }, []);

  const clearAuth = useCallback(() => {
    setAccessToken(null);
    setRole(null);
  }, []);

  const refreshAccessToken = useCallback(async () => {
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
  }, [clearAuth]);

  useEffect(() => {
    refreshAccessToken();
  }, [refreshAccessToken]);

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