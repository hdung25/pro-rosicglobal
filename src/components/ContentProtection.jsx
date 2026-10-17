import { useEffect } from "react";

export default function ContentProtection({ disabled = false }) {
  useEffect(() => {
    if (disabled) return;
    const protect = (event) => {
      if (event.target.closest?.('input, textarea, select, [contenteditable="true"]')) return;
      if (event.type === "dragstart" && event.target.tagName !== "IMG") return;
      event.preventDefault();
      window.alert("ALERT: Content is protected !!");
    };
    const events = ["contextmenu", "copy", "cut", "dragstart"];
    events.forEach((name) => document.addEventListener(name, protect));
    return () => events.forEach((name) => document.removeEventListener(name, protect));
  }, [disabled]);
  return null;
}
