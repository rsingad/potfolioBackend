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

// Connect to MongoDB
app.use(session({
  secret: "supersecret",
  resave: false,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
connectDB();
app.use(cors({
  origin: "http://localhost:5173",  // ✅ React frontend
  credentials: true                // ✅ allow session cookie to be sent
}));
app.use(cors());
app.use(express.json());
app.use("/api/contact", contactRoutes);
app.use("/auth", require("./routes/auth"));




app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
