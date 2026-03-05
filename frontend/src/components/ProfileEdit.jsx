import { useState } from "react";

const uid = () => Math.random().toString(36).slice(2, 9);

export default function ProfileEdit({ profile, onSave, onCancel, saving }) {
  const [form, setForm] = useState({
    ...profile,
    skills: [...(profile.skills || [])],
    experience: [...(profile.experience || [])],
    education: [...(profile.education || [])],
    certification: [...(profile.certification || [])],
    socials: { ...profile.socials },
  });

  // ── generic field helpers ─────────────────────────────────
  const set = (field, val) => setForm((f) => ({ ...f, [field]: val }));
  const setSocial = (key, val) => setForm((f) => ({
    ...f, socials: { ...f.socials, [key]: val }
  }));

  // ── skills ────────────────────────────────────────────────
  const addSkill = () =>
    set("skills", [...form.skills, { id: `s${uid()}`, name: "", level: 50, endorsements: 0 }]);
  const updateSkill = (i, field, val) =>
    set("skills", form.skills.map((s, idx) => idx === i ? { ...s, [field]: val } : s));
  const removeSkill = (i) =>
    set("skills", form.skills.filter((_, idx) => idx !== i));

  // ── experience ────────────────────────────────────────────
  const addExp = () =>
    set("experience", [...form.experience, {
      id: `e${uid()}`, role: "", company: "", location: "Remote", start: "", end: null, description: ""
    }]);
  const updateExp = (i, field, val) =>
    set("experience", form.experience.map((e, idx) => idx === i ? { ...e, [field]: val } : e));
  const removeExp = (i) =>
    set("experience", form.experience.filter((_, idx) => idx !== i));

  // ── education ─────────────────────────────────────────────
  const addEd = () =>
    set("education", [...form.education, {
      id: `ed${uid()}`, degree: "", institution: "", location: "", start: "", end: null, description: ""
    }]);
  const updateEd = (i, field, val) =>
    set("education", form.education.map((e, idx) => idx === i ? { ...e, [field]: val } : e));
  const removeEd = (i) =>
    set("education", form.education.filter((_, idx) => idx !== i));

  // ── certifications ────────────────────────────────────────
  const addCert = () =>
    set("certification", [...form.certification, {
      id: `c${uid()}`, name: "", issuer: "", date: ""
    }]);
  const updateCert = (i, field, val) =>
    set("certification", form.certification.map((c, idx) => idx === i ? { ...c, [field]: val } : c));
  const removeCert = (i) =>
    set("certification", form.certification.filter((_, idx) => idx !== i));

  return (
    <div className="edit-layout">
      <div className="edit-header">
        <h2>✏️ Edit Profile</h2>
        <div className="edit-actions">
          <button className="btn-secondary" onClick={onCancel} disabled={saving}>Cancel</button>
          <button className="btn-primary" onClick={() => onSave(form)} disabled={saving}>
            {saving ? <><span className="mini-spinner" /> Saving…</> : "Save Changes"}
          </button>
        </div>
      </div>

      <div className="edit-body">

        {/* ── BASIC INFO ────────────────────────────── */}
        <div className="gidy-card edit-card">
          <h3 className="edit-section-title">Basic Info</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Full Name</label>
              <input value={form.name || ""} onChange={(e) => set("name", e.target.value)} placeholder="Your name" />
            </div>
            <div className="form-group">
              <label>Title / Role</label>
              <input value={form.title || ""} onChange={(e) => set("title", e.target.value)} placeholder="e.g. Final-Year Student" />
            </div>
            <div className="form-group">
              <label>Location</label>
              <input value={form.location || ""} onChange={(e) => set("location", e.target.value)} placeholder="City, Country" />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" value={form.email || ""} onChange={(e) => set("email", e.target.value)} placeholder="email@example.com" />
            </div>
            <div className="form-group">
              <label>Website</label>
              <input value={form.website || ""} onChange={(e) => set("website", e.target.value)} placeholder="https://yoursite.dev" />
            </div>
            <div className="form-group">
              <label>Avatar URL</label>
              <input value={form.avatar || ""} onChange={(e) => set("avatar", e.target.value)} placeholder="https://..." />
            </div>
            {form.avatar && (
              <div className="form-group avatar-preview-wrap">
                <label>Preview</label>
                <img src={form.avatar} alt="avatar preview" className="avatar-preview" />
              </div>
            )}
            <div className="form-group full-width">
              <label>Bio</label>
              <textarea rows={4} value={form.bio || ""} onChange={(e) => set("bio", e.target.value)} placeholder="Write something about yourself…" />
            </div>
            <div className="form-group toggle-group">
              <label>
                <input type="checkbox" checked={form.availableForWork || false} onChange={(e) => set("availableForWork", e.target.checked)} />
                Open to Work
              </label>
            </div>
          </div>
        </div>

        {/* ── SOCIAL LINKS ──────────────────────────── */}
        <div className="gidy-card edit-card">
          <h3 className="edit-section-title">Social Links</h3>
          <div className="form-grid">
            {["github", "linkedin", "twitter"].map((key) => (
              <div key={key} className="form-group">
                <label style={{ textTransform: "capitalize" }}>{key}</label>
                <input value={form.socials?.[key] || ""} onChange={(e) => setSocial(key, e.target.value)} placeholder={`https://${key}.com/yourhandle`} />
              </div>
            ))}
          </div>
        </div>

        {/* ── SKILLS ────────────────────────────────── */}
        <div className="gidy-card edit-card">
          <div className="edit-section-header">
            <h3 className="edit-section-title">Skills</h3>
            <button className="btn-add" onClick={addSkill}>＋ Add Skill</button>
          </div>
          <div className="skills-edit-list">
            {form.skills.map((skill, i) => (
              <div key={skill.id} className="skill-edit-row">
                <input
                  className="skill-name-input"
                  value={skill.name}
                  onChange={(e) => updateSkill(i, "name", e.target.value)}
                  placeholder="Skill name"
                />
                <div className="skill-level-wrap">
                  <input
                    type="range" min={0} max={100} step={5}
                    value={skill.level}
                    onChange={(e) => updateSkill(i, "level", +e.target.value)}
                  />
                  <span>{skill.level}%</span>
                </div>
                <button className="btn-remove" onClick={() => removeSkill(i)} title="Remove skill">✕</button>
              </div>
            ))}
          </div>
        </div>

        {/* ── EXPERIENCE ────────────────────────────── */}
        <div className="gidy-card edit-card">
          <div className="edit-section-header">
            <h3 className="edit-section-title">Experience</h3>
            <button className="btn-add" onClick={addExp}>＋ Add Experience</button>
          </div>
          <div className="exp-edit-list">
            {form.experience.map((exp, i) => (
              <div key={exp.id} className="exp-edit-item">
                <div className="form-grid">
                  <div className="form-group">
                    <label>Role / Title</label>
                    <input value={exp.role} onChange={(e) => updateExp(i, "role", e.target.value)} placeholder="e.g. AI Intern" />
                  </div>
                  <div className="form-group">
                    <label>Company</label>
                    <input value={exp.company} onChange={(e) => updateExp(i, "company", e.target.value)} placeholder="Company name" />
                  </div>
                  <div className="form-group">
                    <label>Location</label>
                    <input value={exp.location || ""} onChange={(e) => updateExp(i, "location", e.target.value)} placeholder="Remote / City" />
                  </div>
                  <div className="form-group">
                    <label>Start Date</label>
                    <input type="month" value={exp.start} onChange={(e) => updateExp(i, "start", e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>End Date</label>
                    <input type="month" value={exp.end || ""} onChange={(e) => updateExp(i, "end", e.target.value || null)} />
                    <small>Leave blank if current</small>
                  </div>
                  <div className="form-group full-width">
                    <label>Description</label>
                    <textarea rows={3} value={exp.description || ""} onChange={(e) => updateExp(i, "description", e.target.value)} placeholder="What did you do here?" />
                  </div>
                </div>
                <button className="btn-remove-exp" onClick={() => removeExp(i)}>✕ Remove</button>
              </div>
            ))}
          </div>
        </div>

        {/* ── EDUCATION ─────────────────────────────── */}
        <div className="gidy-card edit-card">
          <div className="edit-section-header">
            <h3 className="edit-section-title">Education</h3>
            <button className="btn-add" onClick={addEd}>＋ Add Education</button>
          </div>
          <div className="exp-edit-list">
            {form.education.map((ed, i) => (
              <div key={ed.id} className="exp-edit-item">
                <div className="form-grid">
                  <div className="form-group">
                    <label>Degree</label>
                    <input value={ed.degree} onChange={(e) => updateEd(i, "degree", e.target.value)} placeholder="e.g. B.Tech - CSE" />
                  </div>
                  <div className="form-group">
                    <label>Institution</label>
                    <input value={ed.institution} onChange={(e) => updateEd(i, "institution", e.target.value)} placeholder="University name" />
                  </div>
                  <div className="form-group">
                    <label>Location</label>
                    <input value={ed.location || ""} onChange={(e) => updateEd(i, "location", e.target.value)} placeholder="City" />
                  </div>
                  <div className="form-group">
                    <label>Start Date</label>
                    <input type="month" value={ed.start} onChange={(e) => updateEd(i, "start", e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>End Date</label>
                    <input type="month" value={ed.end || ""} onChange={(e) => updateEd(i, "end", e.target.value || null)} />
                    <small>Leave blank if current</small>
                  </div>
                </div>
                <button className="btn-remove-exp" onClick={() => removeEd(i)}>✕ Remove</button>
              </div>
            ))}
          </div>
        </div>

        {/* ── CERTIFICATIONS ────────────────────────── */}
        <div className="gidy-card edit-card">
          <div className="edit-section-header">
            <h3 className="edit-section-title">Certifications</h3>
            <button className="btn-add" onClick={addCert}>＋ Add Certification</button>
          </div>
          <div className="exp-edit-list">
            {form.certification.map((cert, i) => (
              <div key={cert.id} className="exp-edit-item">
                <div className="form-grid">
                  <div className="form-group">
                    <label>Certificate Name</label>
                    <input value={cert.name} onChange={(e) => updateCert(i, "name", e.target.value)} placeholder="e.g. AWS Cloud Practitioner" />
                  </div>
                  <div className="form-group">
                    <label>Issuer</label>
                    <input value={cert.issuer || ""} onChange={(e) => updateCert(i, "issuer", e.target.value)} placeholder="e.g. Amazon Web Services" />
                  </div>
                  <div className="form-group">
                    <label>Date</label>
                    <input type="month" value={cert.date || ""} onChange={(e) => updateCert(i, "date", e.target.value)} />
                  </div>
                </div>
                <button className="btn-remove-exp" onClick={() => removeCert(i)}>✕ Remove</button>
              </div>
            ))}
            {form.certification.length === 0 && (
              <p className="empty-state">No certifications yet. Click "＋ Add Certification" to add one.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
