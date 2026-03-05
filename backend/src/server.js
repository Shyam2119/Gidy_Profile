/**
 * server.js — Application entry point
 *
 * Responsibilities (only):
 *   • Configure Express middleware
 *   • Mount route modules
 *   • Start the HTTP server
 *
 * Business logic  → src/controllers/profileController.js
 * Database access → src/models/db.js
 * Route mapping   → src/routes/profile.js
 */
const express = require("express");
const cors = require("cors");

// Importing the DB module triggers schema creation + seeding on first run
require("./models/db");

const profileRoutes = require("./routes/profile");
const { generateBio } = require("./controllers/profileController");

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ─────────────────────────────────────────────────
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || "http://localhost:3000",
    "http://localhost:5173",  // Vite dev server
    "http://localhost:4173",  // Vite preview
  ],
}));
app.use(express.json());

// ── Routes ─────────────────────────────────────────────────────
app.use("/api/profile", profileRoutes);          // GET/PUT /api/profile, POST endorse
app.post("/api/generate-bio", generateBio);           // POST /api/generate-bio
app.get("/api/health", (_req, res) =>                 // GET  /api/health
  res.json({ status: "ok", ts: new Date().toISOString() })
);

// ── Start ──────────────────────────────────────────────────────
app.listen(PORT, () =>
  console.log(`🚀 Gidy Profile API running on http://localhost:${PORT}`)
);
