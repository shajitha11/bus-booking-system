import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { customerSignup } from "../services/api";

function Signup() {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSignup = async (e) => {
        e.preventDefault();

        if (!username || !email || !password || !confirmPassword || !phone) {
            setError("All fields are required");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setError("");
        setLoading(true);

        try {
            const res = await customerSignup({
                username, email, password, confirmPassword, phone
            });

            if (res.success) {
                navigate("/login", { replace: true });
            } else {
                setError(res.error || "Signup failed");
            }
        } catch (err) {
            setError("Server error");
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="center-page">
            <h2>Signup</h2>
            <div className="signup">
                <form className="signupform" onSubmit={handleSignup}>
                    <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />

                    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />

                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />

                    <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />

                    <input type="text" placeholder="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />

                    {error && <p style={{ color: "red" }}>{error}</p>}

                    <button type="submit" disabled={loading}>
                        {loading ? "Signing up..." : "Signup"}
                    </button>

                </form>

                <p>
                    Already have an account?  <button> <Link to="/login">Login</Link></button>
                </p>

            </div>
        </div>
    )
}
export default Signup;
