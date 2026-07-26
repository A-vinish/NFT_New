import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const { login } = useAuth();
  const history = useHistory();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(form.email, form.password);
      history.push("/discover");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-container">
      <h3>Log in</h3>
      {error && <div className="auth-error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="auth-field">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" value={form.email} onChange={handleChange} required />
        </div>
        <div className="auth-field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="auth-submit">
          <button
            type="submit"
            disabled={submitting}
            className="form-ButtonBase-root form-Chip-root makeStyles-chipBlue-108 form-Chip-clickable"
            style={{ border: "none", width: "100%" }}
          >
            <span className="form-Chip-label">{submitting ? "Logging in..." : "Log in"}</span>
          </button>
        </div>
      </form>
      <div className="auth-switch">
        Don't have an account? <Link to="/register">Register</Link>
      </div>
    </div>
  );
}

export default Login;
