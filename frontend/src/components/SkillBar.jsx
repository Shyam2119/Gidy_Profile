export default function SkillBar({ skill, endorsed, endorsing, onEndorse }) {
  return (
    <div className={`skill-item ${endorsed ? "endorsed" : ""}`}>
      <div className="skill-header">
        <span className="skill-name">{skill.name}</span>
        <div className="skill-right">
          <button
            className={`endorse-btn ${endorsed ? "endorsed" : ""}`}
            onClick={onEndorse}
            disabled={endorsed || endorsing}
            title={endorsed ? "You already endorsed this" : "Endorse this skill"}
          >
            {endorsing ? (
              <span className="mini-spinner" />
            ) : endorsed ? (
              <><span>✓</span> Endorsed</>
            ) : (
              <><span>👍</span> Endorse</>
            )}
          </button>
          <span className="endorse-count">{skill.endorsements}</span>
        </div>
      </div>
      <div className="skill-bar-bg">
        <div
          className="skill-bar-fill"
          style={{ width: `${skill.level}%` }}
        >
          <span className="skill-pct">{skill.level}%</span>
        </div>
      </div>
    </div>
  );
}
