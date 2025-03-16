export interface AuthContextType {
  accessToken: string | null;
  role: string | null;
  name: string | null; // Stores the user's name
  setAuth: (token: string, role: string, name: string) => void; // Accepts name
  clearAuth: () => void;
  refreshAccessToken: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>; // ✅ Added login function
}
