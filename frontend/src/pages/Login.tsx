// src/pages/Login.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState(false); // true if email is invalid after clicking login
  const { setAuth } = useAuth();
  const navigate = useNavigate();

  // Function to validate email format
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Check email format only on form submission
    if (!validateEmail(email)) {
      setEmailError(true);
      return;
    } else {
      setEmailError(false);
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/login`,
        { email, password },
        { withCredentials: true }
      );

      const { accessToken, role, name, id } = response.data;
      setAuth(accessToken, role, name, id);

      if (role === "admin") {
        navigate("/dashboard/admin");
      } else {
        navigate("/dashboard/agent");
      }
    } catch (err: any) {
      if (err.response) {
        setError(err.response.data.error || "Invalid Credentials. Please enter correct credentials.");
      } else if (err.request) {
        setError("No response from server. Please try again.");
      } else {
        setError("An unexpected error occurred.");
      }
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      {error && <p className="error">{error}</p>}
      {emailError && <p className="error">Invalid email format</p>} {/* Shows only after clicking Login */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={email}
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          required
        />       
        <input
          type="password"
          value={password}
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
