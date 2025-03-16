export interface AuthContextType {
  accessToken: string | null;
  role: string | null;
  name: string | null;
  id: string | null;
  setAuth: (token: string, role: string, name: string, id: string) => void;
  clearAuth: () => void;
  refreshAccessToken: () => Promise<void>;
}