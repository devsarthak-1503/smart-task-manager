import { createContext, useState, useEffect, useContext } from "react";
import API from "../api/api";
import { toast } from "react-toastify";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token") || null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUser = () => {
            if (token) {
                try {
                    // Set token header for this request
                    API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
                    const savedUser = localStorage.getItem("user");
                    if (savedUser) {
                        setUser(JSON.parse(savedUser));
                    } else {
                        setUser({ name: "User" });
                    }
                } catch (error) {
                    console.error("Error loading user profile", error);
                    logout();
                }
            } else {
                setUser(null);
                delete API.defaults.headers.common["Authorization"];
            }
            setLoading(false);
        };
        loadUser();
    }, [token]);

    const login = async (email, password) => {
        try {
            const response = await API.post("/login", { email, password });
            const { token: receivedToken, user: loggedUser } = response.data;
            
            localStorage.setItem("token", receivedToken);
            localStorage.setItem("user", JSON.stringify(loggedUser));
            
            setToken(receivedToken);
            setUser(loggedUser);
            API.defaults.headers.common["Authorization"] = `Bearer ${receivedToken}`;
            
            toast.success("Welcome back! Login successful");
            return true;
        } catch (error) {
            const msg = error.response?.data?.message || "Login failed. Please check credentials.";
            toast.error(msg);
            throw new Error(msg);
        }
    };

    const register = async (name, email, password) => {
        try {
            const response = await API.post("/register", { name, email, password });
            toast.success(response.data.message || "Registration successful! Please login.");
            return true;
        } catch (error) {
            const msg = error.response?.data?.message || "Registration failed. Try again.";
            toast.error(msg);
            throw new Error(msg);
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setToken(null);
        setUser(null);
        delete API.defaults.headers.common["Authorization"];
        toast.info("Logged out successfully");
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
