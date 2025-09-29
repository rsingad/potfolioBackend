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
const isProduction = process.env.NODE_ENV === 'production';
const ONE_DAY = 1000 * 60 * 60 * 24;

// 🔥 FIX: Localhost origins added back for development compatibility
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5000',
  'https://main--rameshpotfoliyo.netlify.app',
  "https://potfoliobackend-76c7.onrender.com",
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
  secret: process.env.SESSION_SECRET || "supersecret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    // Production (HTTPS) के लिए TRUE, Local (HTTP) के लिए FALSE।
    secure: isProduction,

    // Cross-site communication के लिए 'none' (केवल secure: true के साथ काम करता है)।
    // Localhost के लिए 'lax' रखें।
    sameSite: isProduction ? 'none' : 'lax',

    maxAge: ONE_DAY // 1 day
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