// routes/contactRoutes.js
const express = require("express");
const router = express.Router();
const { submitContactForm, getAllContacts } = require("../controllers/contactController");

router.post("/", submitContactForm);
router.get("/", getAllContacts);

module.exports = router;
