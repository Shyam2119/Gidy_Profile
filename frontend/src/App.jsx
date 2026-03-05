import { useState, useEffect, useCallback } from "react";
import ProfileView from "./components/ProfileView";
import ProfileEdit from "./components/ProfileEdit";
import { fetchProfile, updateProfile } from "./api/profileApi";
import "./index.css";

export default function App() {
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("gidy_dark_mode") === "true"
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", darkMode ? "dark" : "light");
    localStorage.setItem("gidy_dark_mode", darkMode);
  }, [darkMode]);

  useEffect(() => {
    fetchProfile()
      .then((data) => { setProfile(data); setLoading(false); })
      .catch(() => { setError("Could not load profile. Is the backend running?"); setLoading(false); });
  }, []);

  const handleSave = useCallback(async (updated) => {
    setSaving(true);
    try {
      const saved = await updateProfile(updated);
      setProfile(saved);
      setEditMode(false);
    } catch {
      alert("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  }, []);

  const initials = profile?.name?.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase() || "U";

  return (
    <div className="app-root">
      {/* ── TOP NAVIGATION ── */}
      <header className="top-nav">
        <div className="nav-left">
          {/* Gidy Logo */}
          <a href="#" className="nav-logo">
            <svg width="26" height="26" viewBox="0 0 40 40" fill="none">
              <path d="M8 8 L20 2 L32 8 L32 28 L20 34 L8 28 Z" fill="#f5820a" opacity="0.95" />
              <path d="M14 15 L26 15 M14 20 L22 20 M14 25 L24 25" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            <span className="nav-logo-text">Gidy</span>
          </a>
          {/* Nav links */}
          <nav className="nav-links">
            {["Jobs", "Hackathons", "Projects", "Tasks", "Organization"].map((item) => (
              <a key={item} href="#" className="nav-link">{item}</a>
            ))}
          </nav>
        </div>

        <div className="nav-right">
          <button
            className="icon-btn"
            onClick={() => setDarkMode((d) => !d)}
            title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            aria-label="Toggle dark mode"
          >
            {darkMode ? "☀️" : "🌙"}
          </button>

          {!editMode && profile && (
            <button className="btn-primary" onClick={() => setEditMode(true)}>
              ✏️ Edit Profile
            </button>
          )}

          {/* Profile avatar */}
          <div className="nav-avatar" title={profile?.name || "Profile"}>
            {profile?.avatar ? (
              <img src={profile.avatar} alt={profile.name} />
            ) : (
              <span>{initials}</span>
            )}
            <span className="nav-avatar-caret">▾</span>
          </div>
        </div>
      </header>

      {/* ── MAIN CONTENT ── */}
      <main className="main-content">
        {loading && (
          <div className="loading-screen">
            <div className="spinner" />
            <p>Loading profile…</p>
          </div>
        )}
        {error && (
          <div className="error-screen">
            <span className="error-icon">⚠️</span>
            <p>{error}</p>
            <p className="error-hint">Start the backend: <code>cd backend && npm run dev</code></p>
          </div>
        )}
        {!loading && !error && profile && (
          editMode ? (
            <ProfileEdit
              profile={profile}
              onSave={handleSave}
              onCancel={() => setEditMode(false)}
              saving={saving}
            />
          ) : (
            <ProfileView profile={profile} setProfile={setProfile} />
          )
        )}
      </main>
    </div>
  );
}
