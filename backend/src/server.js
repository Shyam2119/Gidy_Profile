/**
 * server.js — Application entry point
 *
 * Responsibilities:
 *   • Configure Express middleware
 *   • Mount API route modules
 *   • Serve React frontend static build (production)
 *   • Start the HTTP server
 *
 * Business logic  → src/controllers/profileController.js
 * Database access → src/models/db.js
 * Route mapping   → src/routes/profile.js
 */
const express = require("express");
const cors = require("cors");
const path = require("path");

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
    "http://localhost:5173",
    "http://localhost:4173",
  ],
}));
app.use(express.json());

// ── API Routes ─────────────────────────────────────────────────
app.use("/api/profile", profileRoutes);
app.post("/api/generate-bio", generateBio);
app.get("/api/health", (_req, res) =>
  res.json({ status: "ok", ts: new Date().toISOString() })
);

// ── Serve React Frontend (production build) ────────────────────
const FRONTEND_DIST = path.join(__dirname, "../../frontend/dist");
app.use(express.static(FRONTEND_DIST));

// All non-API routes → index.html (React client-side routing)
app.get("*", (_req, res) => {
  res.sendFile(path.join(FRONTEND_DIST, "index.html"));
});

// ── Start ──────────────────────────────────────────────────────
app.listen(PORT, () =>
  console.log(`🚀 Gidy Profile running on http://localhost:${PORT}`)
);
