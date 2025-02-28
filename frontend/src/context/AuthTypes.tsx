// src/context/authTypes.ts
export interface AuthContextType {
    accessToken: string | null;
    role: string | null;
    setAuth: (token: string, role: string) => void;
    clearAuth: () => void;
    refreshAccessToken: () => Promise<void>;
  }
  