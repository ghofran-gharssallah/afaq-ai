import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * React Router doesn't reset scroll position on navigation (unlike a real
 * MPA) and doesn't auto-scroll to a URL hash on its own. This restores both:
 * a hash in the URL scrolls to that element — matching the site's existing
 * intra-page anchors (Footer links into the About page's sub-sections, the
 * Home page's #technologies) — otherwise every navigation lands at the top
 * of the new page.
 */
const ScrollManager = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (hash) {
      // The target section belongs to the page that just mounted — wait a
      // frame so it exists in the DOM before scrolling to it.
      const raf = requestAnimationFrame(() => {
        document
          .getElementById(hash.slice(1))
          ?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
      });
      return () => cancelAnimationFrame(raf);
    }

    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname, hash]);

  return null;
};

export default ScrollManager;
