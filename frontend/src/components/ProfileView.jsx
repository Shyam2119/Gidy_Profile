import { useState } from "react";
import AIBioGenerator from "./AIBioGenerator";
import { endorseSkill } from "../api/profileApi";

// ── helpers ──────────────────────────────────────────────────
const fmt = (d) => {
  if (!d) return "Present";
  const [y, m] = d.split("-");
  return new Date(y, m - 1).toLocaleDateString("en-US", { month: "short", year: "numeric" });
};

// League medal colours
const LEAGUE_COLORS = {
  Bronze: { bg: "#cd7f32", light: "rgba(205,127,50,.12)", text: "#7f4f00" },
  Silver: { bg: "#9e9e9e", light: "rgba(158,158,158,.12)", text: "#424242" },
  Gold: { bg: "#f9a825", light: "rgba(249,168,37,.12)", text: "#7f6000" },
};

// ── sub-components ────────────────────────────────────────────

/** Three-dot kebab menu button (display only) */
function KebabMenu() {
  return (
    <button className="kebab-btn" title="More options" aria-label="More options">
      <span />
      <span />
      <span />
    </button>
  );
}

/** Circular building icon for experience/education */
function EntityIcon({ emoji = "🏢" }) {
  return <div className="entity-icon">{emoji}</div>;
}

/** Section header with optional Add (+) button */
function SectionHeader({ title, onAdd }) {
  return (
    <div className="section-header-row">
      <h2 className="section-heading">{title}</h2>
      {onAdd && (
        <button className="btn-add-circle" onClick={onAdd} title={`Add ${title}`} aria-label={`Add ${title}`}>
          ＋
        </button>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────
export default function ProfileView({ profile, setProfile }) {
  const [skills, setSkills] = useState(profile.skills || []);
  const [endorsing, setEndorsing] = useState(null);
  const [endorsedSet, setEndorsedSet] = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem("gidy_endorsed") || "[]")); }
    catch { return new Set(); }
  });
  const [expandedExp, setExpandedExp] = useState(null);

  const league = profile.league || "Bronze";
  const leagueColor = LEAGUE_COLORS[league] || LEAGUE_COLORS.Bronze;

  // Skill endorsement
  const handleEndorse = async (skillId) => {
    if (endorsedSet.has(skillId) || endorsing) return;
    setEndorsing(skillId);
    try {
      const updated = await endorseSkill(skillId);
      setSkills(updated.skills);
      const next = new Set([...endorsedSet, skillId]);
      setEndorsedSet(next);
      localStorage.setItem("gidy_endorsed", JSON.stringify([...next]));
    } finally {
      setEndorsing(null);
    }
  };

  return (
    <div className="profile-page">

      {/* ══════════════════════════════════════════════
          CARD 1 — PROFILE HEADER
      ══════════════════════════════════════════════ */}
      <div className="gidy-card profile-header-card">
        <div className="profile-header-inner">
          {/* Left: avatar + info */}
          <div className="pheader-left">
            <div className="avatar-wrap">
              <img src={profile.avatar} alt={profile.name} className="profile-avatar" />
            </div>
            <div className="pheader-info">
              <div className="pheader-name-row">
                <h1 className="profile-name">{profile.name}</h1>
                {profile.title && (
                  <span className="profile-title-badge">( {profile.title} )</span>
                )}
              </div>
              {profile.location && (
                <p className="profile-location">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>
                  {profile.location}
                </p>
              )}

              <div className="pheader-actions">
                {profile.email && (
                  <a href={`mailto:${profile.email}`} className="email-link">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m2 7 10 7 10-7" /></svg>
                    {profile.email}
                  </a>
                )}
                <a href={profile.resumeUrl || "#"} className="btn-resume" download>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                  Download Resume
                </a>
              </div>

              {/* Social links */}
              {profile.socials && (
                <div className="social-row">
                  {profile.socials.github && (
                    <a href={profile.socials.github} className="social-chip" target="_blank" rel="noreferrer">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" /></svg>
                      GitHub
                    </a>
                  )}
                  {profile.socials.linkedin && (
                    <a href={profile.socials.linkedin} className="social-chip" target="_blank" rel="noreferrer">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                      LinkedIn
                    </a>
                  )}
                  {profile.socials.twitter && (
                    <a href={profile.socials.twitter} className="social-chip" target="_blank" rel="noreferrer">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.26 5.632zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                      Twitter
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right: League badge + kebab */}
          <div className="pheader-right">
            <KebabMenu />
            <div className="league-card" style={{ background: leagueColor.light, borderColor: leagueColor.bg + "44" }}>
              <div className="league-medal" style={{ background: leagueColor.bg }}>
                🏅
              </div>
              <div className="league-stats">
                <div className="league-col">
                  <span className="league-label">League</span>
                  <span className="league-val" style={{ color: leagueColor.text }}>{league}</span>
                </div>
                <div className="league-divider" />
                <div className="league-col">
                  <span className="league-label">Rank</span>
                  <span className="league-val">{profile.rank ?? "—"}</span>
                </div>
                <div className="league-divider" />
                <div className="league-col">
                  <span className="league-label">Points</span>
                  <span className="league-val">{profile.points ?? "—"}</span>
                </div>
              </div>
            </div>
            <a href="#" className="view-rewards-link">View My Rewards ＞</a>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          CARD 2 — CAREER GOALS
      ══════════════════════════════════════════════ */}
      <div className="gidy-card career-goals-card">
        <div className="career-goals-inner">
          <div className="career-goals-text">
            <h2 className="career-goals-title">Tell us where you want to go</h2>
            <p className="career-goals-body">
              Add your <span className="hl">career goals</span> and{" "}
              <span className="hl">what inspires you</span>. This helps us tailor
              recommendations, learning paths, and opportunities just for you.
            </p>
          </div>
          <button className="btn-career-goals">✦ Add your career goals</button>
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          TWO-COLUMN GRID
      ══════════════════════════════════════════════ */}
      <div className="two-col-grid">

        {/* LEFT COLUMN */}
        <div className="col-left">

          {/* Level Up Profile */}
          <div className="gidy-card levelup-card">
            <div className="levelup-header">
              <span className="levelup-dot" />
              <span className="levelup-title">Level Up Profile</span>
            </div>
            <p className="levelup-subtitle">Just a few clicks away from awesomeness, complete your profile!</p>

            <div className="levelup-progress-row">
              <span className="levelup-pct-label">Progress: {profile.profileProgress ?? 64}%</span>
            </div>
            <div className="progress-bar-bg">
              <div className="progress-bar-fill" style={{ width: `${profile.profileProgress ?? 64}%` }} />
            </div>

            <div className="levelup-tasks">
              {(profile.profileTasks || []).filter(t => !t.done).map((task) => (
                <div key={task.id} className="levelup-task-row">
                  <div className="levelup-task-info">
                    <span className="levelup-task-emoji">{task.emoji}</span>
                    <div>
                      <span className="levelup-task-label">{task.label}</span>
                      <span className="levelup-task-pts"> (+{task.points}%)</span>
                      <p className="levelup-task-hint">{task.hint}</p>
                    </div>
                  </div>
                  <button className="btn-add-circle sm">＋</button>
                </div>
              ))}
            </div>
          </div>

          {/* Skills — chip style */}
          <div className="gidy-card skills-card">
            <SectionHeader title="Skills" />
            <div className="skills-chip-grid">
              {skills.map((skill) => {
                const done = endorsedSet.has(skill.id);
                return (
                  <button
                    key={skill.id}
                    className={`skill-chip ${done ? "endorsed" : ""}`}
                    onClick={() => handleEndorse(skill.id)}
                    disabled={done || endorsing === skill.id}
                    title={done ? `Endorsed · ${skill.endorsements} endorsements` : `Endorse "${skill.name}" · ${skill.endorsements} endorsements`}
                  >
                    {endorsing === skill.id ? <span className="mini-spinner" /> : null}
                    {skill.name}
                    {skill.endorsements > 0 && (
                      <span className="chip-count">{skill.endorsements}</span>
                    )}
                    {done && <span className="chip-check">✓</span>}
                  </button>
                );
              })}
            </div>
            <p className="skills-endorse-hint">👆 Click a skill chip to endorse it</p>
          </div>

          {/* AI Bio Generator */}
          <div className="gidy-card">
            <AIBioGenerator profile={{ ...profile, skills }} />
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="col-right">

          {/* About / Bio */}
          {profile.bio && (
            <div className="gidy-card bio-card">
              <h2 className="section-heading">About</h2>
              <p className="bio-text">{profile.bio}</p>
            </div>
          )}

          {/* Experience */}
          <div className="gidy-card">
            <SectionHeader title="Experience" />
            {(profile.experience || []).length === 0 ? (
              <p className="empty-state">No experience added yet.</p>
            ) : (
              <div className="entity-list">
                {(profile.experience || []).map((exp) => (
                  <div key={exp.id} className="entity-item" onClick={() => setExpandedExp(expandedExp === exp.id ? null : exp.id)}>
                    <EntityIcon emoji="🏢" />
                    <div className="entity-info">
                      <div className="entity-title">{exp.role}</div>
                      <div className="entity-sub">
                        {exp.company}
                        {exp.location && <span className="entity-tag">{exp.location}</span>}
                      </div>
                      <div className="entity-dates">{fmt(exp.start)} — {fmt(exp.end)}</div>
                      {expandedExp === exp.id && exp.description && (
                        <p className="entity-desc">{exp.description}</p>
                      )}
                    </div>
                    <KebabMenu />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Education */}
          <div className="gidy-card">
            <SectionHeader title="Education" />
            {(profile.education || []).length === 0 ? (
              <p className="empty-state">No education added yet.</p>
            ) : (
              <div className="entity-list">
                {(profile.education || []).map((ed) => (
                  <div key={ed.id} className="entity-item">
                    <EntityIcon emoji="🎓" />
                    <div className="entity-info">
                      <div className="entity-title">{ed.degree}</div>
                      <div className="entity-sub">
                        {ed.institution}
                        {ed.location && <span className="entity-tag">{ed.location}</span>}
                      </div>
                      <div className="entity-dates">{fmt(ed.start)} — {fmt(ed.end)}</div>
                    </div>
                    <KebabMenu />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Certification */}
          <div className="gidy-card cert-card">
            <SectionHeader title="Certification" />
            {(profile.certification || []).length === 0 ? (
              <div className="cert-empty">
                <span className="cert-empty-icon">📜</span>
                <p>Add Your Certifications!</p>
              </div>
            ) : (
              <div className="entity-list">
                {(profile.certification || []).map((cert) => (
                  <div key={cert.id} className="entity-item">
                    <EntityIcon emoji="📜" />
                    <div className="entity-info">
                      <div className="entity-title">{cert.name}</div>
                      <div className="entity-sub">{cert.issuer}</div>
                      {cert.date && <div className="entity-dates">{fmt(cert.date)}</div>}
                    </div>
                    <KebabMenu />
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
