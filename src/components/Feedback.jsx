import { useState } from "react";
import { Quote } from "lucide-react";
import "./Feedback.css";

// Layout examples are clearly marked and never attributed to real people or companies.
const SAMPLE_IDS = ["distribution", "retail", "import", "foodservice", "processing", "growing", "procurement", "food"];
const INITIALS = ["PP", "BL", "NK", "NH", "CB", "VT", "TM", "TP"];

import { FEEDBACK_COPY } from "../feedback-copy";
import { mergeText } from "../cms/content-overrides";

function localizedSamples(copy) {
  return copy.samples.map(([role, topic, text], index) => ({
    id: SAMPLE_IDS[index],
    initials: INITIALS[index],
    role,
    topic,
    text,
  }));
}

function FeedbackCard({ item, tone, sampleLabel }) {
  return (
    <article className={`feedback-card feedback-tone-${tone}`}>
      <div className="feedback-card-top">
        <Quote size={25} strokeWidth={1.2} aria-hidden="true" />
        <span>{item.topic}</span>
      </div>
      <blockquote>{item.text}</blockquote>
      <div className="feedback-author">
        <span className="feedback-avatar" aria-hidden="true">
          {item.initials}
        </span>
        <div>
          <h4>{item.role}</h4>
          <p>{sampleLabel}</p>
        </div>
      </div>
    </article>
  );
}

export default function Feedback({ language = "vi", textOverrides }) {
  const [paused, setPaused] = useState(false);
  const copy = mergeText(FEEDBACK_COPY[language] ?? FEEDBACK_COPY.en, textOverrides);
  const samples = localizedSamples(copy);

  return (
    <div
      className={`feedback-section ${paused ? "feedback-paused" : ""}`}
      aria-labelledby="feedback-title"
    >
      <div className="feedback-heading container">
        <div>
          <h3 id="feedback-title">{copy.heading}</h3>
          <p className="feedback-disclosure">{copy.disclosure}</p>
        </div>
      </div>
      <div
        className="feedback-rails"
        tabIndex={0}
        role="region"
        aria-label={copy.region}
        aria-description={copy.help}
        onClick={() => setPaused((value) => !value)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setPaused((value) => !value);
          }
        }}
      >
        {[samples.slice(0, 4), samples.slice(4)].map((row, rowIndex) => (
          <div className={`feedback-rail feedback-rail-${rowIndex}`} key={rowIndex}>
            <div className="feedback-track">
              {[0, 1].map((copyIndex) => (
                <div
                  className="feedback-set"
                  key={copyIndex}
                  aria-hidden={copyIndex ? true : undefined}
                >
                  {row.map((item, index) => (
                    <FeedbackCard
                      item={item}
                      tone={(index + rowIndex) % 3}
                      sampleLabel={copy.region}
                      key={item.id}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
