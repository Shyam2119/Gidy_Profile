import { useState } from "react";

export default function WorkTimeline({ experience, formatDate }) {
  const [activeId, setActiveId] = useState(experience[0]?.id);

  return (
    <div className="timeline">
      {experience.map((exp, i) => {
        const isActive = activeId === exp.id;
        return (
          <div
            key={exp.id}
            className={`timeline-item ${isActive ? "active" : ""}`}
            onClick={() => setActiveId(isActive ? null : exp.id)}
          >
            <div className="timeline-dot-wrap">
              <div className={`timeline-dot ${i === 0 ? "current" : ""}`} />
              {i < experience.length - 1 && <div className="timeline-line" />}
            </div>
            <div className="timeline-content">
              <div className="timeline-header">
                <div>
                  <h3 className="timeline-role">{exp.role}</h3>
                  <span className="timeline-company">{exp.company}</span>
                </div>
                <span className="timeline-dates">
                  {formatDate(exp.start)} — {formatDate(exp.end)}
                </span>
              </div>
              {isActive && (
                <p className="timeline-desc">{exp.description}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
