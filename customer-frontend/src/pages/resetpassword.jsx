import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { resetPassword } from "../services/api";

function ResetPassword() {
  const navigate = useNavigate();
  const tempToken = localStorage.getItem("resetTempToken");

  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!otp || !password || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await resetPassword({
        otp,
        tempToken,
        password,
        confirmPassword,
      });

      if (res.success) {
        localStorage.removeItem("resetTempToken");
        navigate("/login", { replace: true });
      }
    } catch (err) {
      const errorMsg = err.message;

      if (errorMsg === "OTP attempts exceeded") {
        alert("Too many OTP attempts. Please login again.");
        localStorage.removeItem("resetTempToken");
        navigate("/login", { replace: true });
      } else if (errorMsg === "Invalid OTP") {
        setError("Invalid OTP");
      }
      else {
        setError(errorMsg || "Invalid OTP");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="center-page">
      <h2>Reset Password</h2>

      <form className="reset" onSubmit={handleResetPassword}>
        <input
          type="number"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />

        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
}

export default ResetPassword;
