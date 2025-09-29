// index.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const contactRoutes = require("./routes/contactRoutes");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
require("./config/passport"); // Passport strategy
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// 🔥 FIX: Localhost origins added back for development compatibility
const allowedOrigins = [
    'http://localhost:5173', 
    'http://localhost:3000', 
    'https://main--rameshpotfoliyo.netlify.app', // Netlify Preview/Deployment URL
    "https://rameshsingad.com" // Final Production Domain
];

// CORS Configuration
const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (e.g., Postman) OR if origin is in the allowed list
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            // Block requests from unapproved domains
            callback(new Error(`CORS blocked request from origin: ${origin}`));
        }
    },
    credentials: true 
};

// Connect to MongoDB
connectDB();

// Middleware Setup
app.use(express.json());

// Session Middleware (CRUCIAL for HTTPS/Cross-Domain Login)
app.use(session({
    secret: process.env.SESSION_SECRET || "supersecret", // Ensure SESSION_SECRET is in your Render vars
    resave: false,
    saveUninitialized: true,
    cookie: {
        // MUST be true in production (HTTPS) to send cookies across domains (Render -> rameshsingad.com)
        secure: true, 
        // MUST be 'none' for cross-site communication (Render is different from rameshsingad.com)
        sameSite: 'none', 
        maxAge: 1000 * 60 * 60 * 24 // 1 day
    }
}));

// Apply CORS middleware
app.use(cors(corsOptions));

// Passport Setup
app.use(passport.initialize());
app.use(passport.session());


// Routes
app.use("/api/contact", contactRoutes);
app.use("/auth", require("./routes/auth"));

// Server Start
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`CORS configured for: ${allowedOrigins.join(' | ')}`);
});