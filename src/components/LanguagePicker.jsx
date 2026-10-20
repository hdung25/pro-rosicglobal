import { useId } from "react";
import { ChevronDown } from "lucide-react";
import { LANGUAGES } from "../language";
import "./LanguagePicker.css";

export function LanguagePicker({ language, onChange, compact = false, className = "", label = "Language selection" }) {
  const id = useId();
  const selected = LANGUAGES.find((item) => item.code === language) ?? LANGUAGES[0];

  return (
    <label className={`language-picker ${compact ? "language-picker-compact" : ""} ${className}`} htmlFor={id}>
      <img className="language-picker-flag" src={selected.flag} alt="" width="21" height="15" aria-hidden="true" />
      <span className="sr-only">{label}</span>
      <select id={id} translate="no" value={language} onChange={(event) => onChange(event.target.value)}>
        {LANGUAGES.map((item) => (
          <option key={item.code} value={item.code} lang={item.code} translate="no">
            {item.shortLabel}
          </option>
        ))}
      </select>
      <ChevronDown className="language-picker-chevron" size={13} aria-hidden="true" />
    </label>
  );
}
