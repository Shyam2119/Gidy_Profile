/**
 * models/db.js
 * Database connection, schema creation, and seed data.
 * Uses better-sqlite3 (synchronous SQLite driver).
 */
const Database = require("better-sqlite3");
const path = require("path");

// ── Connection ────────────────────────────────────────────────
const db = new Database(path.join(__dirname, "../profile.db"));

// Enable WAL mode for better concurrent read performance
db.pragma("journal_mode = WAL");

// ── Schema ────────────────────────────────────────────────────
db.exec(`
  CREATE TABLE IF NOT EXISTS profiles (
    id         TEXT PRIMARY KEY,
    data       TEXT NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS skills (
    id           TEXT PRIMARY KEY,
    profile_id   TEXT NOT NULL,
    name         TEXT NOT NULL,
    level        INTEGER NOT NULL DEFAULT 50 CHECK (level BETWEEN 0 AND 100),
    endorsements INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_skills_profile ON skills(profile_id);
`);

// ── Seed (only if no profile exists) ─────────────────────────
const DEFAULT_PROFILE_ID = "user_001";

if (!db.prepare("SELECT id FROM profiles WHERE id = ?").get(DEFAULT_PROFILE_ID)) {
    const defaultProfile = {
        id: DEFAULT_PROFILE_ID,
        name: "Shyam Pattipu",
        title: "Final-Year Student",
        bio: "Final year B.Tech CSE student with a focus on AI and full-stack development. I enjoy building practical applications — from ML-powered tools to web apps — and I'm always looking for projects where I can learn something new. Outside coding, I like watching tech videos and reading about what's happening in the AI space.",
        avatar: "https://i.pravatar.cc/300?img=12",
        location: "Vijayawada, India",
        website: "https://github.com/Sasigaya3",
        email: "shyampattipu@gmail.com",
        availableForWork: true,
        resumeUrl: "#",
        league: "Bronze",
        rank: 34,
        points: 50,
        profileProgress: 64,
        profileTasks: [
            { id: "t1", label: "Complete Your Bio", emoji: "✍️", points: 20, done: false, hint: "Tell us about yourself in a few words!" },
            { id: "t2", label: "Upload Your Certificates", emoji: "🎓", points: 16, done: false, hint: "Boost your profile with relevant certifications." },
            { id: "t3", label: "Add Social Links", emoji: "🔗", points: 10, done: true, hint: "Connect your GitHub, LinkedIn, and more." },
            { id: "t4", label: "Add Experience", emoji: "💼", points: 20, done: true, hint: "Showcase your internships and work." },
        ],
        socials: {
            github: "https://github.com/Sasigaya3",
            linkedin: "https://linkedin.com/in/shyam-pattipu",
            twitter: "",
        },
        experience: [
            {
                id: "e1", role: "AI Intern", company: "Slashmark IT",
                location: "Remote", start: "2024-06", end: "2024-09",
                description: "Worked on machine learning projects including chatbot development and data analysis pipelines. Got hands-on with Python, scikit-learn, and REST API deployment.",
            },
            {
                id: "e2", role: "GEN AI Intern", company: "Codegnanit Solutions",
                location: "Remote", start: "2024-01", end: "2024-05",
                description: "Built a document summarisation tool using LangChain and OpenAI APIs, integrated with a React frontend. Learned a lot about prompt engineering and working with LLMs practically.",
            },
        ],
        education: [
            {
                id: "ed1", degree: "B.Tech - CSE (AI & ML)",
                institution: "NRI Institute of Technology", location: "Vijayawada",
                start: "2022-09", end: null,
                description: "Studying Computer Science with a specialisation in Artificial Intelligence and Machine Learning. Active in hackathons and college tech projects.",
            },
        ],
        certification: [],
        stats: { projects: 12, endorsements: 21, connections: 148 },
    };

    db.prepare("INSERT INTO profiles (id, data) VALUES (?, ?)")
        .run(DEFAULT_PROFILE_ID, JSON.stringify(defaultProfile));

    const insertSkill = db.prepare(
        "INSERT INTO skills (id, profile_id, name, level, endorsements) VALUES (?, ?, ?, ?, ?)"
    );
    [
        { id: "s1", name: "Python", level: 85, endorsements: 8 },
        { id: "s2", name: "Java", level: 72, endorsements: 5 },
        { id: "s3", name: "C", level: 68, endorsements: 4 },
        { id: "s4", name: "Full Stack Development", level: 78, endorsements: 10 },
        { id: "s5", name: "SQL", level: 74, endorsements: 6 },
        { id: "s6", name: "Web Development", level: 76, endorsements: 7 },
        { id: "s7", name: "Machine Learning", level: 65, endorsements: 4 },
        { id: "s8", name: "React", level: 70, endorsements: 5 },
        { id: "s9", name: "Flask", level: 62, endorsements: 3 },
    ].forEach((s) => insertSkill.run(s.id, DEFAULT_PROFILE_ID, s.name, s.level, s.endorsements));
}

module.exports = { db, DEFAULT_PROFILE_ID };
