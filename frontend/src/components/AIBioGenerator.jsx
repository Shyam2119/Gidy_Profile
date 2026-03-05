import { useState } from "react";
import { generateBio } from "../api/profileApi";

const TONES = [
  { id: "professional", label: "💼 Professional" },
  { id: "casual", label: "😊 Casual" },
  { id: "creative", label: "🎨 Creative" },
];

export default function AIBioGenerator({ profile }) {
  const [tone, setTone] = useState("professional");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleGenerate = async () => {
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const data = await generateBio({
        name: profile.name,
        title: profile.title,
        location: profile.location,
        skills: profile.skills || [],
        experience: profile.experience || [],
        tone,
      });
      setResult(data.bio);
    } catch {
      setError("Could not generate bio. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard?.writeText(result);
    alert("Copied to clipboard!");
  };

  return (
    <div className="ai-bio-section">
      {/* Header */}
      <div className="ai-bio-header">
        <span className="ai-badge">✨ AI-Powered</span>
        <h3 className="ai-bio-title">Generate AI Bio</h3>
        <p className="ai-bio-subtitle">
          Let AI craft a personalised bio based on your skills &amp; experience.
        </p>
      </div>

      {/* Controls */}
      <div className="ai-controls">
        <div className="tone-selector">
          {TONES.map((t) => (
            <button
              key={t.id}
              className={`tone-btn ${tone === t.id ? "active" : ""}`}
              onClick={() => setTone(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>
        <button className="btn-generate" onClick={handleGenerate} disabled={loading}>
          {loading ? <><span className="mini-spinner" /> Generating…</> : <>⚡ Generate Bio</>}
        </button>
      </div>

      {/* Error */}
      {error && <p className="ai-error">{error}</p>}

      {/* Result */}
      {result && (
        <div className="ai-result">
          <p className="ai-result-text">{result}</p>
          <div className="ai-result-actions">
            <button className="use-bio-btn" onClick={handleCopy}>
              📋 Copy to Clipboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
