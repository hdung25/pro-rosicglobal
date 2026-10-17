// Only known text paths can be overridden; functions and application structure stay intact.
export function mergeText(base, patch) {
  if (typeof base === "string") return typeof patch === "string" ? patch : base;
  if (Array.isArray(base)) return base.map((value, index) => mergeText(value, patch?.[index]));
  if (base && typeof base === "object") return Object.fromEntries(Object.entries(base).map(([key, value]) => [key, mergeText(value, patch?.[key])]));
  return base;
}
export function setTextPath(source, path, value) {
  if (!path.length) return value;
  const [key, ...rest] = path;
  return { ...source, [key]: setTextPath(source?.[key], rest, value) };
}
