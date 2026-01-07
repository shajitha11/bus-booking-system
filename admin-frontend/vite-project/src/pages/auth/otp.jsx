import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { verifyAdminOtp } from "../../services/api";

function Otp() {
  const navigate = useNavigate();

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("tempToken");
    if (!token) {
      navigate("/login", { replace: true });
    }
  }, []);

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    if (!otp) {
      setError("OTP required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await verifyAdminOtp({
        otp,
        tempToken: localStorage.getItem("tempToken"),
      });

      if (res.success) {
        localStorage.setItem("mainToken", res.mainToken);
        localStorage.removeItem("tempToken");
        navigate("/dashboard", { replace: true });
      } else {
        setError("Invalid OTP");
      }
    } catch (err) {
      const errorMsg = err.response?.data?.error;

      if (errorMsg === "Invalid OTP") {
        setError("Invalid OTP");
      }
      else if (errorMsg === "OTP attempts exceeded") {
        alert("Too many OTP attempts. Please login again.");
        localStorage.removeItem("tempToken");
        navigate("/login", { replace: true });
      }
      else if (errorMsg === "OTP expired") {
        alert("OTP expired. Please login again.");
        localStorage.removeItem("tempToken");
        navigate("/login", { replace: true });
      }
      else {
        setError("Something went wrong");
      }
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <div className="center-page">
      <div className="otp">
        <h2>OTP Verification</h2>

        <form className="otpform" onSubmit={handleVerifyOtp}>
          <input
            type="number"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />

          {error && <p style={{ color: "red" }}>{error}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Otp;
