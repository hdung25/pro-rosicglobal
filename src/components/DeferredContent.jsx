import { Children, useEffect, useRef, useState } from "react";

const sections = ["export-catalog", "products", "journey", "testimonials", "blog", "contact"];

// Prioritize the first screen. Navigation and scrolling always load content
// immediately; the timer also makes the complete page available to find-in-page.
export default function DeferredContent({ children }) {
  const [ready, setReady] = useState(false);
  const region = useRef(null);
  useEffect(() => {
    const show = () => setReady(true);
    const onHash = () => { if (sections.includes(window.location.hash.slice(1))) show(); };
    const onNavigate = event => {
      const href = event.target.closest?.('a[href^="#"]')?.getAttribute("href");
      if (sections.includes(href?.slice(1))) show();
    };
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) show();
    }, { rootMargin: "250px" });
    observer.observe(region.current);
    const timer = window.setTimeout(show, 1400);
    window.addEventListener("hashchange", onHash);
    document.addEventListener("click", onNavigate);
    onHash();
    return () => { observer.disconnect(); window.clearTimeout(timer); window.removeEventListener("hashchange", onHash); document.removeEventListener("click", onNavigate); };
  }, []);
  useEffect(() => {
    if (!ready) return;
    window.dispatchEvent(new Event("rosic:content-ready"));
    const id = window.location.hash.slice(1);
    if (sections.includes(id)) document.getElementById(id)?.scrollIntoView({ behavior: "instant" });
  }, [ready]);
  const content = Children.toArray(children);
  return <div ref={region}>{sections.map((id, index) => <div id={id} key={id} aria-busy={!ready}>{ready ? content[index] : <div style={{ minHeight: 900 }} />}</div>)}</div>;
}
