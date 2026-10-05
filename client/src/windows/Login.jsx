import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import "../styles/Login.css";

export default function Login() {
  const { login, register, user, logout } = useAuth();
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await register(email, password);
      }
      setEmail("");
      setPassword("");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (user) {
    return (
      <div className="login-window">
        <p>
          Signed in as <strong>{user.email}</strong>
          {user.role === "admin" && " (admin)"}
        </p>
        <button className="login-submit-button" onClick={logout}>
          Log Out
        </button>
      </div>
    );
  }

  return (
    <div className="login-window">
      <div className="login-tabs">
        <span
          className={mode === "login" ? "properties-tab active" : "properties-tab"}
          onClick={() => { setMode("login"); setError(""); }}
        >
          Log In
        </span>
        <span
          className={mode === "register" ? "properties-tab active" : "properties-tab"}
          onClick={() => { setMode("register"); setError(""); }}
        >
          Register
        </span>
      </div>

      <form className="login-form" onSubmit={handleSubmit}>
        <div className="form-field">
          <label htmlFor="login-email">Email:</label>
          <input
            id="login-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="off"
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="login-password">Password:</label>
          <input
            id="login-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="off"
            required
            minLength={mode === "register" ? 8 : undefined}
          />
        </div>

        {error && (
          <p className="field-error" aria-live="polite">{error}</p>
        )}

        <button type="submit" className="login-submit-button" disabled={isSubmitting}>
          {isSubmitting ? "..." : mode === "login" ? "Log In" : "Create Account"}
        </button>
      </form>
    </div>
  );
}