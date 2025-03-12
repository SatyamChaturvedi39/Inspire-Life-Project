export interface AuthContextType {
  accessToken: string | null;
  role: string | null;
  name: string | null;           // Added field to store the user's name
  setAuth: (token: string, role: string, name: string) => void; // Accept name as parameter
  clearAuth: () => void;
  refreshAccessToken: () => Promise<void>;
}