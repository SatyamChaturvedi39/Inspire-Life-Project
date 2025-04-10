// src/api/axiosInstance.ts
import axios from "axios";
import { useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";

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
      return config;
    },
    (error) => Promise.reject(error)
  );

  return instance;
};
