const router = require("express").Router();
const passport = require("passport");
const User = require("../models/User");


router.get("/github", passport.authenticate("github", { scope: ["user:email"] }));
// GitHub Login
router.get("/github/login", passport.authenticate("github", { scope: ["user:email"] }));

// GitHub Signup (optional - same as login)
router.get("/github/signup", passport.authenticate("github", { scope: ["user:email"] }));

// GitHub Callback
router.get("/github/callback",
  passport.authenticate("github", {
    successRedirect: "https://main--rameshpotfoliyo.netlify.app/dashboard", // redirect to React dashboard
    failureRedirect: "https://main--rameshpotfoliyo.netlify.app/login",     // optional: login fail
  })
);

// Logout
router.get("/logout", (req, res) => {
  req.logout(() => {
    res.redirect("https://main--rameshpotfoliyo.netlify.app");
  });
});

// router.get("/me", (req, res) => {
//   if (req.isAuthenticated()) {
//     res.json(req.user);
//   } else {
//     res.status(401).json({ message: "Not authenticated" });
//   }
// })
router.get("/all-users", async (req, res) => {
  try {
    const users = await User.find();  // ✅ Ye line zaroori hai
    res.status(200).json(users);      // ✅ Ab users exist karega
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
