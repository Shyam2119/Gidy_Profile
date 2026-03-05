// profileApi.js — HTTP client for the Express backend
// In production: Express serves frontend, so /api is relative (same origin).
// In dev: Vite proxies /api → http://localhost:5000 (see vite.config.js).
const BASE_URL = import.meta.env.VITE_API_URL || "";

/**
 * GET /api/profile
 * Fetches the full profile (with skills) from the database.
 */
export async function fetchProfile() {
  const res = await fetch(`${BASE_URL}/api/profile`);
  if (!res.ok) throw new Error("Failed to fetch profile");
  return res.json();
}

/**
 * PUT /api/profile
 * Saves updated profile data (including skills) to the database.
 */
export async function updateProfile(data) {
  const res = await fetch(`${BASE_URL}/api/profile`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update profile");
  return res.json();
}

/**
 * POST /api/profile/skills/:id/endorse
 * Increments the endorsement count for a skill (Innovation: Skill Endorsement System).
 */
export async function endorseSkill(skillId) {
  const res = await fetch(`${BASE_URL}/api/profile/skills/${skillId}/endorse`, {
    method: "POST",
  });
  if (!res.ok) throw new Error("Failed to endorse skill");
  return res.json();
}

/**
 * POST /api/generate-bio
 * Calls the backend AI bio generator (Innovation: AI-Powered Bio Generator).
 * @param {{ name, title, location, skills, experience, tone }} payload
 */
export async function generateBio(payload) {
  const res = await fetch(`${BASE_URL}/api/generate-bio`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Bio generation failed");
  return res.json(); // { bio, source }
}
