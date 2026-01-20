import { useState } from "react";
import { AxiosError } from "axios";
import { loginUser, registerUser, googleAuth } from "../api/auth.api";
import { setToken, clearToken } from "../utils/token";

type ApiError = {
  message: string;
};

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);

      const res = await loginUser({ email, password });

      // 🔥 FIX HERE
      const token = res.data?.token;
      if (!token) throw new Error("Token missing");

      setToken(token);
      return true;
    } catch (err: unknown) {
      const axiosError = err as AxiosError<ApiError>;
      setError(
        axiosError?.response?.data?.message || "Login failed"
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string
  ) => {
    try {
      setLoading(true);
      setError(null);

      const res = await registerUser({ name, email, password });

      // 🔥 FIX HERE
      const token = res.data?.token;
      if (!token) throw new Error("Token missing");

      setToken(token);
      return true;
    } catch (err: unknown) {
      const axiosError = err as AxiosError<ApiError>;
      setError(
        axiosError?.response?.data?.message || "Registration failed"
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async (credential: string) => {
    try {
      setLoading(true);
      setError(null);

      const res = await googleAuth(credential);
      const token = res.data?.token;
      if (!token) throw new Error("Token missing");

      setToken(token);
      return true;
    } catch (err: unknown) {
      const axiosError = err as AxiosError<ApiError>;
      setError(
        axiosError?.response?.data?.message ||
          "Google sign-in failed"
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    clearToken();
  };

  return { login, register, loginWithGoogle, logout, loading, error };
};
