/**
 * routes/profile.js
 * Declares all /api/profile routes and maps them to controller functions.
 * No business logic here — keeps routing clean and readable.
 */
const express = require("express");
const router = express.Router();
const {
    getProfile,
    updateProfile,
    endorseSkill,
    generateBio,
} = require("../controllers/profileController");

// Profile CRUD
router.get("/", getProfile);    // GET  /api/profile
router.put("/", updateProfile); // PUT  /api/profile

// Skill endorsement (Innovation Feature 1)
router.post("/skills/:skillId/endorse", endorseSkill);  // POST /api/profile/skills/:id/endorse

// AI bio generation (Innovation Feature 2) — mounted under /api
// Exported separately and mounted in server.js as /api/generate-bio

module.exports = router;
