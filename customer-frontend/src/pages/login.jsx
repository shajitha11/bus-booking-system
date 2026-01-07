import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { customerLogin } from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setError("All fields are required");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await customerLogin({ username, password });

      if (res.success) {
        localStorage.setItem("tempToken", res.tempToken);
        navigate("/verifyOtp");
      } else {
        setError(res.error || "Login failed");
      }
    } catch {
      setError("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="center-page">
      <h2>Login</h2>
      <div className="login">

        <form className="loginform" onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className="error">{error}</p>}
          <div className="btn-sec">
            <button type="button" className="signup-btn" disabled={loading} onClick={() => navigate("/signup")}>
              Signup
            </button>
            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>
          <button type="button" className="forgot-btn" disabled={loading} onClick={() => navigate("/forgotPassword")}>
            Forgot Password ?
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
