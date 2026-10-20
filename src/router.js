import { useEffect, useState } from "react";

/**
 * Minimal path router for the public site.
 *
 *   /                          home (sections are still reached by #hash)
 *   /san-pham                  home, scrolled to the product finder
 *   /san-pham/:group           group page
 *   /san-pham/:group/:product  product page
 *
 * Scroll position is stored per history entry so Back returns the visitor to
 * exactly where they were (customer item 12).
 */
const EVENT = "rosic:route";

export function parseRoute(pathname = "/") {
  const parts = pathname.replace(/\/+$/, "").split("/").filter(Boolean);
  if (parts[0] !== "san-pham") return { kind: "home" };
  if (parts.length === 1) return { kind: "home", hash: "products" };
  if (parts.length === 2) return { kind: "group", groupSlug: parts[1] };
  return { kind: "product", groupSlug: parts[1], productId: parts[2] };
}

function currentPath() {
  return typeof window === "undefined" ? "/" : window.location.pathname;
}

export function useRoute() {
  const [path, setPath] = useState(currentPath);
  useEffect(() => {
    if ("scrollRestoration" in window.history) window.history.scrollRestoration = "manual";
    const sync = () => setPath(currentPath());
    window.addEventListener("popstate", sync);
    window.addEventListener(EVENT, sync);
    return () => {
      window.removeEventListener("popstate", sync);
      window.removeEventListener(EVENT, sync);
    };
  }, []);
  return { path, ...parseRoute(path) };
}

/**
 * A visitor who lands on a product or group page straight from a search
 * engine has no site page behind it, so Back would leave the site. Put the
 * parent page underneath first: product → its group, group → the product
 * list (customer review, item 9). Runs once per landing; history.state is set
 * afterwards, so reloads and in-site navigation are left alone.
 */
export function seedHistory() {
  if (typeof window === "undefined" || window.history.state !== null) return;
  const route = parseRoute(window.location.pathname);
  if (route.kind !== "product" && route.kind !== "group") return;
  const parent = route.kind === "product" ? `/san-pham/${route.groupSlug}` : "/san-pham";
  const here = `${window.location.pathname}${window.location.search}${window.location.hash}`;
  // The product list is reached by its #products anchor, not a stored position.
  window.history.replaceState(route.kind === "product" ? { scrollY: 0 } : {}, "", parent);
  window.history.pushState({ scrollY: 0 }, "", here);
}

/**
 * useState whose value is also kept in the current history entry, so Back
 * to this page restores it (the chosen product group, "show more" — customer
 * review 20/10, item 9). A new visit to the page starts from `initial`.
 */
export function useHistoryState(key, initial) {
  const [value, setValue] = useState(() => {
    const stored = typeof window === "undefined" ? undefined : window.history.state?.[key];
    return stored === undefined ? initial : stored;
  });
  useEffect(() => {
    window.history.replaceState({ ...(window.history.state || {}), [key]: value }, "");
  }, [key, value]);
  return [value, setValue];
}

function rememberScroll() {
  window.history.replaceState({ ...(window.history.state || {}), scrollY: window.scrollY }, "");
}

/** Wait for a node rendered after a route change, then scroll to it. */
export function scrollToId(id, behavior = "instant") {
  let tries = 0;
  const attempt = () => {
    const node = document.getElementById(id);
    if (node && node.getAttribute("aria-busy") !== "true") {
      node.scrollIntoView({ behavior, block: "start" });
      return;
    }
    if (tries++ < 60) window.requestAnimationFrame(attempt);
  };
  attempt();
}

export function navigate(href, { replace = false } = {}) {
  const url = new URL(href, window.location.origin);
  const target = `${url.pathname}${url.hash}`;
  const samePath = url.pathname === window.location.pathname;
  if (!replace) rememberScroll();
  window.history[replace ? "replaceState" : "pushState"]({ scrollY: 0 }, "", target);
  window.dispatchEvent(new Event(EVENT));
  const hash = url.hash.slice(1) || parseRoute(url.pathname).hash;
  if (hash) {
    window.dispatchEvent(new Event("rosic:show-all"));
    scrollToId(hash, samePath ? "smooth" : "instant");
  } else {
    window.scrollTo({ top: 0, behavior: "instant" });
  }
}

/**
 * Restore the stored scroll position after Back/Forward. Registered once:
 * React flushes the route update synchronously inside `popstate`, so a
 * listener tied to the path would be removed before it ever ran.
 */
export function useScrollRestoration() {
  useEffect(() => {
    const onPop = (event) => {
      const y = event.state?.scrollY;
      if (typeof y !== "number") return;
      window.dispatchEvent(new Event("rosic:show-all"));
      // Lazy sections can change height for a few frames after mounting, so
      // keep re-applying the position until it has been stable for a while.
      let frames = 0;
      let stable = 0;
      const restore = () => {
        window.scrollTo({ top: y, behavior: "instant" });
        stable = Math.abs(window.scrollY - y) <= 2 ? stable + 1 : 0;
        if (stable < 12 && frames++ < 120) window.requestAnimationFrame(restore);
      };
      window.requestAnimationFrame(restore);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);
}

/**
 * Intercept same-origin links to catalogue routes and "/#section" links so
 * they navigate without a full page reload.
 */
export function useLinkInterception() {
  useEffect(() => {
    const onClick = (event) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = event.target.closest?.("a[href]");
      if (!anchor || anchor.target === "_blank" || anchor.hasAttribute("download")) return;
      const href = anchor.getAttribute("href");
      if (!href || !(href.startsWith("/san-pham") || href.startsWith("/#") || href === "/")) return;
      event.preventDefault();
      navigate(href);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);
}
