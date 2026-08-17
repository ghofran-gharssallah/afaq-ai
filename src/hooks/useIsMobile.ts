import { useEffect, useState } from "react";

const QUERY = "(max-width: 639px)";

/**
 * Mirrors this project's `max-sm:` Tailwind breakpoint (640px) so JS-driven
 * animation choices (e.g. dropping an expensive `filter` transition on
 * mobile) match the same split the CSS already uses.
 */
export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.matchMedia(QUERY).matches
  );

  useEffect(() => {
    const mql = window.matchMedia(QUERY);
    const onChange = () => setIsMobile(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return isMobile;
};
