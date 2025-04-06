import axios from "axios";
import { useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";

// This hook returns an Axios instance that always attaches the latest token.
export const useAxiosInstance = () => {
  const { accessToken, refreshAccessToken } = useAuth();
  const tokenRef = useRef(accessToken);

  useEffect(() => {
    tokenRef.current = accessToken;
  }, [accessToken]);

  const instance = axios.create({
    baseURL: `${import.meta.env.VITE_BACKEND_URL}/api`,
    withCredentials: true,
  });

  instance.interceptors.request.use(
    async (config) => {
      if (!tokenRef.current) {
        await refreshAccessToken();
      }
      if (tokenRef.current) {
        config.headers.Authorization = `Bearer ${tokenRef.current}`;
      }
      console.log("[AxiosInstance] Request headers:", config.headers);
      return config;
    },
    (error) => Promise.reject(error)
  );

  return instance;
};
