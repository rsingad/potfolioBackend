const router = require("express").Router();
const passport = require("passport");
const User = require("../models/User");

// --- Middleware: Checks if user is logged in ---
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next(); // User is logged in, continue.
    }
    // If not authenticated, send 401 Unauthorized
    res.status(401).json({ message: "Authentication required to access this resource." }); 
}

// --- 1. GITHUB AUTHENTICATION ROUTES ---

// Initial redirect to GitHub
router.get("/github", passport.authenticate("github", { scope: ["user:email"] }));

// GitHub Callback Route (Uses hardcoded URL as requested)
router.get(
    "/github/callback",
    passport.authenticate("github", {
        successRedirect: "https://rameshsingad.com/dashboard", 
        failureRedirect: "https://rameshsingad.com/login",     
    })
);

// --- 2. USER SESSION ROUTES ---

// Logout Route
router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.session.destroy((err) => {
            if (err) {
                return next(err);
            }
            res.redirect("https://rameshsingad.com/");
        });
    });
});

// Get Current User (Used by Dashboard.jsx to check session status)
router.get("/me", (req, res) => {
    if (req.isAuthenticated()) {
        // Return public user data from session
        const user = req.user;
        res.status(200).json({
            username: user.username,
            name: user.name,
            githubId: user.githubId, 
            isAuthenticated: true
        });
    } else {
        // Crucial: Send 401 if not logged in
        res.status(401).json({ isAuthenticated: false, message: "User not authenticated." });
    }
});

// --- 3. ADMIN/DATA ROUTES ---

// 🔥 FIX: Get all users (Protected by ensureAuthenticated middleware)
router.get("/all-users", ensureAuthenticated, async (req, res) => {
    try {
        // If the request reaches here, the user is authenticated via the cookie.
        const users = await User.find().select('username name githubId'); 
        res.status(200).json(users); 
    } catch (err) {
        console.error("Error fetching users:", err);
        res.status(500).json({ message: "Server error during user fetch." });
    }
});

module.exports = router;
