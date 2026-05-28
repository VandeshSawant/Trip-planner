import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import "../styles/Login.css";

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password");
      return;
    }

    if (!isValidEmail(email.trim())) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axiosInstance.post("/auth/login", {
        email: email.trim(),
        password: password.trim(),
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userId", response.data.userId);
      localStorage.setItem("userName", response.data.name);

      navigate("/dashboard");
    } catch (err) {
      if (!err.response) {
        setError("Unable to connect. Please check your connection.");
      } else if (err.response?.status === 401) {
        setError("Invalid email or password");
      } else {
        setError("Login failed. Please try again.");
      }
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (
      !name.trim() ||
      !email.trim() ||
      !password.trim() ||
      !confirmPassword.trim()
    ) {
      setError("Please fill in all fields");
      return;
    }

    if (!isValidEmail(email.trim())) {
      setError("Please enter a valid email address");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await axiosInstance.post("/users", {
        name: name.trim(),
        email: email.trim(),
        password: password.trim(),
      });

      setIsRegister(false);
      setName("");
      setConfirmPassword("");
      setPassword("");
      setSuccess(
        "Registration successful! Please login with your credentials.",
      );
    } catch (err) {
      if (!err.response) {
        setError("Unable to connect. Please check your connection.");
      } else if (err.response?.status === 409) {
        setError("This email is already registered. Please login instead.");
      } else {
        setError("Registration failed. Please try again.");
      }
      console.error("Register error:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsRegister(!isRegister);
    setError("");
    setSuccess("");
    setEmail("");
    setPassword("");
    setName("");
    setConfirmPassword("");
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Trip Planner</h1>
        <p className="login-subtitle">
          {isRegister ? "Create an account" : "Sign in to your account"}
        </p>

        <form onSubmit={isRegister ? handleRegister : handleLogin}>
          {isRegister && (
            <div className="login-form-group">
              <label htmlFor="name">Full Name:</label>
              <input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError("");
                }}
                className={error ? "login-input-error" : ""}
                disabled={loading}
              />
            </div>
          )}

          <div className="login-form-group">
            <label htmlFor="email">Email:</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              className={error ? "login-input-error" : ""}
              disabled={loading}
            />
          </div>

          <div className="login-form-group">
            <label htmlFor="password">Password:</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              className={error ? "login-input-error" : ""}
              disabled={loading}
            />
          </div>

          {isRegister && (
            <div className="login-form-group">
              <label htmlFor="confirmPassword">Confirm Password:</label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setError("");
                }}
                className={error ? "login-input-error" : ""}
                disabled={loading}
              />
            </div>
          )}

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <button
            type="submit"
            className="btn btn-primary btn-full login-btn"
            disabled={loading}
          >
            {loading
              ? isRegister
                ? "Creating account..."
                : "Logging in..."
              : isRegister
                ? "Register"
                : "Login"}
          </button>
        </form>

        <div className="login-toggle-auth">
          <p>
            {isRegister
              ? "Already have an account? "
              : "Don't have an account? "}
            <button
              type="button"
              onClick={toggleMode}
              className="login-toggle-btn"
              disabled={loading}
            >
              {isRegister ? "Login" : "Register"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
