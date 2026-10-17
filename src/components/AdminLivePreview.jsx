import { useEffect, useRef, useState } from "react";

export default function AdminLivePreview({ data, device }) {
  const frame = useRef(null);
  const viewport = useRef(null);
  const [availableWidth, setAvailableWidth] = useState(400);
  const width = device === "mobile" ? 390 : 1440;
  const scale = Math.min(1, availableWidth / width);
  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => setAvailableWidth(entry.contentRect.width));
    observer.observe(viewport.current);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const send = () => frame.current?.contentWindow?.postMessage({ type: "rosic-preview-data", data }, window.location.origin);
    const ready = (event) => {
      if (event.origin === window.location.origin && event.source === frame.current?.contentWindow && event.data?.type === "rosic-preview-ready") send();
    };
    const update = window.setTimeout(send, 100);
    window.addEventListener("message", ready);
    return () => { window.clearTimeout(update); window.removeEventListener("message", ready); };
  }, [data]);
  return (
    <div className="live-preview-viewport" ref={viewport}>
      <div style={{ width: width * scale, marginInline: "auto" }}>
        <iframe ref={frame} title={`Live Preview ${device === "mobile" ? "Mobile" : "Desktop"}`} src="/?preview=1" style={{ width, height: 760 / scale, transform: `scale(${scale})`, transformOrigin: "top left" }} />
      </div>
    </div>
  );
}
