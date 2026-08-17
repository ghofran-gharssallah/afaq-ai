import { useEffect, useState } from "react";

/**
 * Tracks a `window.matchMedia` query reactively. Used to make React
 * conditionally MOUNT one side of a responsive split rather than rendering
 * both and hiding one with CSS — a `display:none` element still runs any
 * Framer Motion `repeat: Infinity` loop on it forever, since those are driven
 * by Framer's own rAF engine, not native CSS animation, and know nothing
 * about visibility.
 */
export const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(
    () => typeof window !== "undefined" && window.matchMedia(query).matches
  );

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);

  return matches;
};

const MOBILE_QUERY = "(max-width: 639px)";

/**
 * Mirrors this project's `max-sm:` Tailwind breakpoint (640px) so JS-driven
 * animation choices (e.g. dropping an expensive `filter` transition on
 * mobile) match the same split the CSS already uses.
 */
export const useIsMobile = () => useMediaQuery(MOBILE_QUERY);
