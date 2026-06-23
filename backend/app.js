const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");

const app = express();

// Security Headers Middleware
app.use(helmet());

// CORS configuration (allow dynamic FRONTEND_URL or allow all in development)
const allowedOrigin = process.env.FRONTEND_URL || "*";
app.use(cors({
    origin: allowedOrigin === "*" ? true : allowedOrigin,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

// Body parser
app.use(express.json({ limit: "10kb" })); // limit body size to prevent DDoS

// Rate Limiter to protect authentications
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: { message: "Too many requests from this IP, please try again after 15 minutes." },
    standardHeaders: true,
    legacyHeaders: false
});

// Mount Rate Limiter on auth routes
app.use("/register", authLimiter);
app.use("/login", authLimiter);

// Health check / API entry point
app.get("/", (req, res) => {
    res.json({
        status: "success",
        message: "Smart Task Manager API is running",
        environment: process.env.NODE_ENV || "development"
    });
});

// App Routes
app.use(authRoutes);
app.use(taskRoutes);

// 404 handler
app.use((req, res, next) => {
    res.status(404).json({ message: "API Route not found" });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error("Unhandled Error:", err.stack);
    res.status(err.status || 500).json({
        status: "error",
        message: err.message || "An internal server error occurred"
    });
});

module.exports = app;