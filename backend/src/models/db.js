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
        name: "Arjun Sharma",
        title: "Full Stack Developer",
        bio: "Hi, I'm Arjun. I recently completed my computer science degree and I enjoy building web applications. I like working with JavaScript and Python and learning new technologies by doing small projects. Currently exploring backend development and improving my problem solving skills.",
        avatar: "https://randomuser.me/api/portraits/men/32.jpg",
        location: "Bengaluru, India",
        website: "https://arjunportfolio.dev",
        email: "arjun.sharma@gmail.com",
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
            github: "https://github.com/arjunsharma",
            linkedin: "https://linkedin.com/in/arjunsharma",
            twitter: "",
        },
        experience: [
            {
                id: "e1", role: "Software Developer Intern", company: "TechSoft Solutions",
                location: "Remote", start: "2024-01", end: "2024-06",
                description: "Worked on small web applications and helped improve UI components. Fixed bugs and added features to an internal HR tool built with React and Node.js.",
            },
            {
                id: "e2", role: "Personal Projects", company: "Self-Learning",
                location: "Remote", start: "2023-01", end: "2023-12",
                description: "Built a few full stack projects using React and Node.js to practice development. Worked on a task manager app and a simple e-commerce UI as part of self-learning.",
            },
        ],
        education: [
            {
                id: "ed1", degree: "B.E - Computer Science",
                institution: "RV College of Engineering", location: "Bengaluru",
                start: "2020-08", end: "2024-06",
                description: "Studied core CS subjects including data structures, databases, and web development. Participated in a few college hackathons.",
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
        { id: "s1", name: "Python", level: 80, endorsements: 8 },
        { id: "s2", name: "JavaScript", level: 78, endorsements: 11 },
        { id: "s3", name: "React", level: 72, endorsements: 7 },
        { id: "s4", name: "HTML", level: 85, endorsements: 9 },
        { id: "s5", name: "CSS", level: 80, endorsements: 6 },
        { id: "s6", name: "SQL", level: 70, endorsements: 5 },
        { id: "s7", name: "Node.js", level: 65, endorsements: 6 },
        { id: "s8", name: "Git", level: 75, endorsements: 4 },
    ].forEach((s) => insertSkill.run(s.id, DEFAULT_PROFILE_ID, s.name, s.level, s.endorsements));
}

module.exports = { db, DEFAULT_PROFILE_ID };
