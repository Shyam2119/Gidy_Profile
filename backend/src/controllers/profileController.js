/**
 * controllers/profileController.js
 * Business logic for all profile-related operations.
 * Kept separate from routing so each function is independently testable.
 */
const { db, DEFAULT_PROFILE_ID } = require("../models/db");

// ── Helper ────────────────────────────────────────────────────
/**
 * Assembles a full profile object (core data + skills array) from the DB.
 * @param {string} profileId
 * @returns {object|null}
 */
function getFullProfile(profileId) {
    const row = db.prepare("SELECT data FROM profiles WHERE id = ?").get(profileId);
    if (!row) return null;
    const profile = JSON.parse(row.data);
    const skills = db.prepare("SELECT * FROM skills WHERE profile_id = ?").all(profileId);
    return { ...profile, skills };
}

// ── Controllers ───────────────────────────────────────────────

/**
 * GET /api/profile
 * Returns the full profile with skills array.
 */
const getProfile = (req, res) => {
    const profile = getFullProfile(DEFAULT_PROFILE_ID);
    if (!profile) return res.status(404).json({ error: "Profile not found" });
    res.json(profile);
};

/**
 * PUT /api/profile
 * Updates core profile fields and syncs the skills table.
 * Skills are passed in the request body as `skills[]` and fully replaced.
 */
const updateProfile = (req, res) => {
    const { skills, ...profileData } = req.body;

    const existing = db
        .prepare("SELECT id FROM profiles WHERE id = ?")
        .get(DEFAULT_PROFILE_ID);
    if (!existing) return res.status(404).json({ error: "Profile not found" });

    // Persist updated profile blob
    db.prepare(
        "UPDATE profiles SET data = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?"
    ).run(JSON.stringify({ ...profileData, id: DEFAULT_PROFILE_ID }), DEFAULT_PROFILE_ID);

    // Sync skills — delete old, insert new
    if (Array.isArray(skills)) {
        db.prepare("DELETE FROM skills WHERE profile_id = ?").run(DEFAULT_PROFILE_ID);
        const insert = db.prepare(
            "INSERT INTO skills (id, profile_id, name, level, endorsements) VALUES (?, ?, ?, ?, ?)"
        );
        skills.forEach((s) =>
            insert.run(s.id, DEFAULT_PROFILE_ID, s.name, s.level ?? 50, s.endorsements ?? 0)
        );
    }

    res.json(getFullProfile(DEFAULT_PROFILE_ID));
};

/**
 * POST /api/profile/skills/:skillId/endorse
 * Innovation — Skill Endorsement System.
 * Atomically increments the endorsement count for a single skill.
 */
const endorseSkill = (req, res) => {
    const { skillId } = req.params;
    const skill = db
        .prepare("SELECT * FROM skills WHERE id = ? AND profile_id = ?")
        .get(skillId, DEFAULT_PROFILE_ID);

    if (!skill) return res.status(404).json({ error: "Skill not found" });

    db.prepare("UPDATE skills SET endorsements = endorsements + 1 WHERE id = ?").run(skillId);
    res.json(getFullProfile(DEFAULT_PROFILE_ID));
};

/**
 * POST /api/generate-bio
 * Innovation — AI-Powered Bio Generator.
 * Calls Anthropic Claude server-side to avoid CORS and API-key exposure.
 * Falls back to curated templates when ANTHROPIC_API_KEY is not set.
 */
const generateBio = async (req, res) => {
    const { name, title, location, skills = [], experience = [], tone = "professional" } = req.body;
    if (!name || !title) {
        return res.status(400).json({ error: "name and title are required" });
    }

    const skillNames = skills.map((s) => s.name).join(", ") || "various technologies";
    const expText = experience.map((e) => `${e.role} at ${e.company}`).join("; ") || "various roles";

    const toneMap = {
        professional: "third person, formal and authoritative",
        casual: "first person, friendly and approachable",
        creative: "first person, energetic and creative",
    };

    const prompt = `Generate a compelling ${tone} professional bio for ${name}, a ${title}${location ? ` based in ${location}` : ""}.
Skills: ${skillNames}.
Experience: ${expText}.
Write 2-3 sentences in ${toneMap[tone] || toneMap.professional} tone. Be specific, human, and avoid clichés. Under 80 words.`;

    const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

    if (!ANTHROPIC_API_KEY) {
        // Template fallback — still high quality, just deterministic
        const top3 = skills.slice(0, 3).map((s) => s.name).join(", ") || "modern technologies";
        const bios = {
            professional: `${name} is a ${title}${location ? ` based in ${location}` : ""} specialising in ${top3}. With hands-on experience spanning ${expText}, they bring a strong foundation in both software engineering and problem-solving to every project they undertake.`,
            casual: `Hi, I'm ${name}! I'm a ${title}${location ? ` from ${location}` : ""} who loves working with ${top3}. I've had the chance to work on some great projects and I'm always looking for new challenges to grow.`,
            creative: `✨ ${name} — a ${title} turning ${top3} into real-world impact${location ? ` from ${location}` : ""}. Driven by curiosity and a love of building things that matter, I'm always exploring what's next.`,
        };
        return res.json({ bio: bios[tone] || bios.professional, source: "template" });
    }

    try {
        const response = await fetch("https://api.anthropic.com/v1/messages", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": ANTHROPIC_API_KEY,
                "anthropic-version": "2023-06-01",
            },
            body: JSON.stringify({
                model: "claude-3-haiku-20240307",
                max_tokens: 300,
                messages: [{ role: "user", content: prompt }],
            }),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error?.message || "Anthropic API error");

        const text = data.content?.map((c) => c.text || "").join("").trim();
        if (!text) throw new Error("Empty response from AI");

        res.json({ bio: text, source: "claude" });
    } catch (err) {
        console.error("[generate-bio]", err.message);
        res.status(500).json({ error: "Bio generation failed. Please try again." });
    }
};

module.exports = { getProfile, updateProfile, endorseSkill, generateBio };
