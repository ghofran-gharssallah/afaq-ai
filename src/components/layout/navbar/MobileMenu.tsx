import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import Logo from "./Logo";
import CTAButton from "./CTAButton";
import { leftLinks, rightLinks } from "../../../constants/navigation";
import { EASE_OUT_EXPO } from "../../../constants/motion";

/** Same left-to-right order the desktop bar renders, just stacked. */
const links = [...leftLinks, ...rightLinks];

/**
 * The button previously had no state and no panel to open — this adds both.
 * The dropdown is portaled to document.body because `.glass` (the pill's own
 * class) sets `overflow:hidden`, which would otherwise clip anything meant to
 * extend below the navbar, and reuses the same glass/glow/border language as
 * the pill itself so it reads as a continuation of it, not a new surface.
 */
const MobileMenu = () => {
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion() ?? false;

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };

    // Scrolling element here is <html>, not <body> — both are locked so the
    // page behind can't scroll while the panel is open.
    const { body, documentElement } = document;
    const gutter = window.innerWidth - documentElement.clientWidth;
    const prevBodyOverflow = body.style.overflow;
    const prevHtmlOverflow = documentElement.style.overflow;
    const prevPadding = body.style.paddingRight;
    body.style.overflow = "hidden";
    documentElement.style.overflow = "hidden";
    if (gutter > 0) body.style.paddingRight = `${gutter}px`;

    document.addEventListener("keydown", onKeyDown);

    return () => {
      body.style.overflow = prevBodyOverflow;
      documentElement.style.overflow = prevHtmlOverflow;
      body.style.paddingRight = prevPadding;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, close]);

  return (
    <>
      {/*
        Center Logo — this, not a missing handler, is why the button never
        responded: a position:absolute box paints above static in-flow
        siblings regardless of source order, and Logo's line-and-mark row
        lays out wide enough that its (mostly invisible) box geometrically
        covers the hamburger button and spacer on narrow viewports. It was
        silently winning every click meant for the button beneath it.
        pointer-events-none here (mobile only — the desktop instance is a
        separate, non-overlapping element and is untouched) removes it from
        hit-testing so clicks fall through to the button/spacer; "Home" is
        still reachable from the first link in the panel this opens.
      */}
      <div
        className="
          pointer-events-none
          absolute
          left-1/2
          top-1/2

          -translate-x-1/2
          -translate-y-1/2
        "
      >
        <Logo />
      </div>

      {/* Menu Button */}
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls="mobile-nav-panel"
        onClick={() => setOpen((v) => !v)}
        className="
          flex
          h-11
          w-11
          items-center
          justify-center

          rounded-xl

          border
          border-white/10

          bg-white/5

          text-white

          transition-all
          duration-300

          hover:bg-white/10
          hover:border-violet-400/30
        "
      >
        {open ? (
          <X size={22} strokeWidth={2.2} />
        ) : (
          <Menu size={22} strokeWidth={2.2} />
        )}
      </button>

      {/* Spacer */}
      <div className="w-11" />

      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {open && (
              <>
                {/* Backdrop — dims the page, closes on click. Sits below the
                    navbar's own z-50 so the hamburger stays clickable to close. */}
                <motion.div
                  className="fixed inset-0 z-40 bg-[#01010A]/72 backdrop-blur-md lg:hidden"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: reduced ? 0.15 : 0.3, ease: "easeOut" }}
                  onClick={close}
                  aria-hidden
                />

                {/* Panel */}
                <motion.div
                  id="mobile-nav-panel"
                  role="dialog"
                  aria-modal="true"
                  aria-label="Mobile navigation"
                  className="fixed left-0 right-0 top-[112px] z-40 flex justify-center px-6 lg:hidden"
                  initial={
                    reduced
                      ? { opacity: 0 }
                      : { opacity: 0, y: -16, filter: "blur(8px)" }
                  }
                  animate={
                    reduced
                      ? { opacity: 1 }
                      : { opacity: 1, y: 0, filter: "blur(0px)" }
                  }
                  exit={
                    reduced
                      ? { opacity: 0 }
                      : { opacity: 0, y: -12, filter: "blur(8px)" }
                  }
                  transition={{
                    duration: reduced ? 0.15 : 0.4,
                    ease: EASE_OUT_EXPO,
                  }}
                >
                  <div
                    className="
                      glass
                      relative

                      w-[1000px]
                      max-w-[82vw]

                      rounded-[24px]

                      px-6
                      py-6

                      shadow-[0_12px_45px_rgba(79,40,183,.14)]
                    "
                  >
                    <div className="glow absolute inset-0 rounded-[24px]" />

                    <ul className="relative flex flex-col gap-1">
                      {links.map((link) => (
                        <li key={link.href}>
                          <a
                            href={link.href}
                            onClick={close}
                            className="
                              flex
                              items-center

                              rounded-xl

                              border
                              border-transparent

                              px-4
                              py-3.5

                              font-['Space_Grotesk']
                              text-[15px]
                              font-medium

                              text-white/70

                              outline-none
                              transition-all
                              duration-300

                              hover:border-white/10
                              hover:bg-white/5
                              hover:text-white

                              focus-visible:border-violet-400/30
                              focus-visible:bg-white/5
                              focus-visible:text-white
                            "
                          >
                            {link.label}
                          </a>
                        </li>
                      ))}
                    </ul>

                    <div
                      className="relative mt-4 flex justify-center border-t border-white/10 pt-5"
                      onClick={close}
                    >
                      <CTAButton immediate />
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
};

export default MobileMenu;
