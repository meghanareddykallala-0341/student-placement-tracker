import { useState } from "react";
import api from "../axiosConfig";

function Register({ onRegister, onBackToLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    const cleanUsername = username.trim();

    if (!cleanUsername || !password || !confirmPassword) {
      alert("Please fill in all fields.");
      return;
    }

    if (cleanUsername.length < 3) {
      alert("Username must contain at least 3 characters.");
      return;
    }

    if (password.length < 6) {
      alert("Password must contain at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      await api.post("/api/register/", {
        username: cleanUsername,
        password: password,
      });

      alert(
        "Registration successful! Please login with your new account."
      );

      setUsername("");
      setPassword("");
      setConfirmPassword("");

      onRegister();
    } catch (error) {
      console.error(
        "Registration error:",
        error.response?.data || error
      );

      if (
        error.response?.data?.username
      ) {
        alert(
          "Username already exists. Please choose another username."
        );
      } else {
        alert(
          "Registration failed. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">

        <div className="login-left">
          <div className="login-brand">
            🎓 Placement Tracker
          </div>

          <h1>
            Start Your
            <br />
            Placement Journey
          </h1>

          <p>
            Create your account and start
            <br />
            managing your placement journey.
          </p>

          <div className="login-illustration">
            🚀
          </div>
        </div>

        <div className="login-right">
          <h2>Create Account</h2>

          <p className="login-subtitle">
            Register for Placement Tracker
          </p>

          <form onSubmit={handleSubmit}>
            <label>Username</label>

            <input
              type="text"
              placeholder="Create username"
              value={username}
              onChange={(e) =>
                setUsername(e.target.value)
              }
            />

            <label>Password</label>

            <input
              type="password"
              placeholder="Create password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
            />

            <label>Confirm Password</label>

            <input
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(e.target.value)
              }
            />

            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              {loading
                ? "Creating Account..."
                : "Register"}
            </button>
          </form>

          <p className="login-footer">
            Already have an account?{" "}
            <span
              className="register-link"
              onClick={onBackToLogin}
            >
              Login
            </span>
          </p>
        </div>

      </div>
    </div>
  );
}

export default Register;