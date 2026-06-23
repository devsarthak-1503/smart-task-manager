import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
    const { user, token, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <h2>⚡ SmartTask</h2>
            </div>
            <div className="navbar-links">
                {token ? (
                    <>
                        <Link to="/" className="nav-item">Dashboard</Link>
                        <span className="user-profile">
                            <span className="avatar-icon">👤</span>
                            {user?.name || "User"}
                        </span>
                        <button onClick={handleLogout} className="btn-logout">
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="nav-item">Login</Link>
                        <Link to="/register" className="nav-item btn-nav-register">Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
