import { Children, useEffect, useRef, useState } from "react";

const sections = ["export-catalog", "products", "private-label", "journey", "testimonials", "blog", "contact"];

// Once shown, later visits to the home page in the same session render the
// full content immediately so Back/Forward can restore the exact position.
let shownOnce = false;

// Prioritize the first screen. Navigation and scrolling always load content
// immediately; the timer also makes the complete page available to find-in-page.
export default function DeferredContent({ children }) {
  const [ready, setReady] = useState(shownOnce);
  const region = useRef(null);
  useEffect(() => {
    if (ready) return undefined;
    const show = () => { shownOnce = true; setReady(true); };
    const onHash = () => { if (sections.includes(window.location.hash.slice(1))) show(); };
    const onNavigate = event => {
      const href = event.target.closest?.('a[href^="#"], a[href^="/#"]')?.getAttribute("href");
      if (sections.includes(href?.replace(/^\/?#/, ""))) show();
    };
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) show();
    }, { rootMargin: "250px" });
    observer.observe(region.current);
    const timer = window.setTimeout(show, 1400);
    window.addEventListener("hashchange", onHash);
    window.addEventListener("rosic:show-all", show);
    document.addEventListener("click", onNavigate);
    onHash();
    return () => { observer.disconnect(); window.clearTimeout(timer); window.removeEventListener("hashchange", onHash); window.removeEventListener("rosic:show-all", show); document.removeEventListener("click", onNavigate); };
  }, [ready]);
  useEffect(() => {
    if (!ready) return;
    window.dispatchEvent(new Event("rosic:content-ready"));
    const id = window.location.hash.slice(1);
    // Back/Forward restores its own stored position; only fresh visits jump to the hash.
    const restoring = (window.history.state?.scrollY ?? 0) > 0;
    if (sections.includes(id) && !restoring) document.getElementById(id)?.scrollIntoView({ behavior: "instant" });
  }, [ready]);
  const content = Children.toArray(children);
  return <div ref={region}>{sections.map((id, index) => <div id={id} key={id} aria-busy={!ready}>{ready ? content[index] : <div style={{ minHeight: 900 }} />}</div>)}</div>;
}
