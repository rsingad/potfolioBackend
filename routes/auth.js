const router = require("express").Router();
const passport = require("passport");
const User = require("../models/User");

// --- 1. GITHUB AUTHENTICATION ROUTES ---

// Initial redirect to GitHub (Used for both login and signup)
// Ensure your passport strategy name ('github') matches your configuration.
router.get("/github", passport.authenticate("github", { scope: ["user:email"] }));

// GitHub Callback Route (Where GitHub redirects the user)
router.get(
    "/github/callback",
    passport.authenticate("github", {
        // NOTE: These URLs should ideally be environment variables (process.env.FRONTEND_URL)
        // Ensure your React frontend is running on 5153
        successRedirect: "https://rameshsingad.com/dashboard", // Redirect to React dashboard (Success)
        failureRedirect: "https://rameshsingad.com/login",     // Redirect to React login/error page (Failure)
    })
);

// --- 2. USER SESSION ROUTES ---

// Logout Route
router.get("/logout", (req, res, next) => {
    // Passport logout method
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        // Also destroy the session for complete cleanup
        req.session.destroy((err) => {
            if (err) {
                return next(err);
            }
            // Redirect user to the homepage or login page
            res.redirect("https://rameshsingad.com/");
        });
    });
});

// Get Current User (Authentication Check)
router.get("/me", (req, res) => {
    if (req.isAuthenticated()) {
        // If authenticated, return the user object stored in the session
        res.status(200).json(req.user);
    } else {
        // If not authenticated
        res.status(401).json({ isAuthenticated: false, message: "User not authenticated." });
    }
});

// --- 3. ADMIN/DATA ROUTES ---

// Get all users (Requires robust authentication/authorization in a real app)
router.get("/all-users", async (req, res) => {
    try {
        // NOTE: Only enable this in a development environment or if you add Admin access checks.
        const users = await User.find().select('-githubId -__v'); // Exclude sensitive/unnecessary fields
        res.status(200).json(users); 
    } catch (err) {
        console.error("Error fetching users:", err);
        res.status(500).json({ message: "Server error during user fetch." });
    }
});

module.exports = router;