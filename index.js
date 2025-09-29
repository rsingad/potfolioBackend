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

const app = express();
const PORT = process.env.PORT || 5000;

// Allowed Origins List
const allowedOrigins = [
  // 'http://localhost:5173', 
  // 'http://localhost:5000',  
  'https://main--rameshpotfoliyo.netlify.app', // Your deployed Netlify frontend
  "https://rameshsingad.com"
];

// CORS Configuration
const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps) OR if origin is in the allowed list
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            // IMPORTANT: Remove the Error, just block access quietly
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true 
};

// Connect to MongoDB
connectDB();

// Middleware Setup
app.use(express.json());
app.use(session({
  secret: "supersecret",
  resave: false,
  saveUninitialized: true,
  cookie: {
       
        secure: true, 
       
        sameSite: 'none', 
       
        // domain: 'rameshsingad.com' 
        maxAge: 1000 * 60 * 60 * 24 
    }
}));

// Apply CORS middleware (FIXED: Only one call)
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