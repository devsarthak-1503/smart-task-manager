import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password) return;
        setSubmitting(true);
        try {
            await login(email, password);
            navigate("/");
        } catch (error) {
            console.error(error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="auth-container">
            <h2>Welcome Back</h2>
            <p className="auth-subtitle">Please enter your credentials to sign in</p>

            <form onSubmit={handleSubmit} className="auth-form">
                <div className="form-group">
                    <label>Email Address</label>
                    <input
                        type="email"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Password</label>
                    <input
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <button type="submit" className="btn btn-primary" disabled={submitting}>
                    {submitting ? "Signing In..." : "Login"}
                </button>
            </form>
            <p className="auth-footer">
                Don't have an account yet? <Link to="/register">Register here</Link>
            </p>
        </div>
    );
}

export default Login;