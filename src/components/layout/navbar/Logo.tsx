import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";

import logo from "../../../assets/logo/logo.png";
import { EASE_OUT_EXPO, EASE_OUT_QUINT, IDLE } from "../../../constants/motion";
import { useIsMobile } from "../../../hooks/useIsMobile";

/**
 * Reference timings for the navbar mark:
 *   0.50s  logo mark fades up            [f_003]
 *   1.00s  light sweep crosses the mark  [f_005]
 *   1.12s  wordmark + side lines resolve [f_006]
 */
const LOGO_IN = 0.5;
const LINES_IN = 1.0;
const WORDMARK_IN = 1.12;

/**
 * The sweep is masked with the logo PNG itself, so the highlight travels
 * across the mark's silhouette instead of a rectangle. Uses the existing
 * transparent asset — nothing about the logo artwork is altered.
 */
const logoMask: React.CSSProperties = {
  WebkitMaskImage: `url(${logo})`,
  maskImage: `url(${logo})`,
  WebkitMaskSize: "contain",
  maskSize: "contain",
  WebkitMaskRepeat: "no-repeat",
  maskRepeat: "no-repeat",
  WebkitMaskPosition: "center",
  maskPosition: "center",
};

const Logo = () => {
  const reduced = useReducedMotion();
  // Same 640px reveal-timing breakpoint every scroll-reveal in the app uses.
  // On mobile: no entrance animation and none of the three continuous
  // `repeat: Infinity` idle loops below (float, breathe, light-sweep) run —
  // their `animate` props are simply not passed, so there's no rAF-driven
  // Framer subscription for them. Desktop (>=640px, including the tablet
  // range where this same component renders inside MobileMenu) is
  // completely unaffected.
  const isMobile = useIsMobile();

  // Tracked on the link rather than via whileHover on the image, so hovering
  // anywhere in the logo group (mark, side lines, wordmark) drives the scale —
  // matching the group-hover behaviour the glow already uses.
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      to="/"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      className="
        group
        relative
        flex
        flex-col
        items-center
        justify-center
        select-none
      "
    >
      {/* Purple Glow */}
      <div
        className="
          absolute
          -z-10

          h-32
          w-32

          rounded-full

          bg-violet-500/10

          blur-[58px]

          transition-all
          duration-500

          group-hover:h-44
          group-hover:w-44
          group-hover:bg-violet-500/35
          group-hover:blur-[80px]
        "
      />

      {/* Logo + Lines */}
      <div
        className="
          relative
          -top-[8px]

          flex
          items-center
          gap-4
        "
      >
        {/* Left Line */}
        <motion.span
          className="
            relative
            top-[10px]

            h-px
            w-[82px]

            origin-right

            bg-gradient-to-r
            from-transparent
            via-violet-400/90
            to-transparent

            transition-all
            duration-500

            group-hover:w-[96px]
          "
          initial={isMobile ? undefined : reduced ? { opacity: 0 } : { opacity: 0, scaleX: 0 }}
          animate={isMobile ? undefined : reduced ? { opacity: 1 } : { opacity: 1, scaleX: 1 }}
          transition={{
            duration: reduced ? 0.3 : 0.6,
            delay: reduced ? 0 : LINES_IN,
            ease: EASE_OUT_EXPO,
          }}
        />

        {/* Logo — entrance + idle float */}
        <motion.div
          className="relative"
          initial={
            isMobile
              ? undefined
              : reduced
              ? { opacity: 0 }
              : { opacity: 0, scale: 0.7, y: -6 }
          }
          animate={
            isMobile
              ? undefined
              : reduced
              ? { opacity: 1 }
              : { opacity: 1, scale: 1, y: [0, -3, 0] }
          }
          transition={{
            opacity: { duration: 0.7, delay: LOGO_IN, ease: EASE_OUT_EXPO },
            scale: { duration: 0.8, delay: LOGO_IN, ease: EASE_OUT_EXPO },
            y: {
              duration: IDLE.navLogoFloat,
              delay: LOGO_IN + 0.8,
              repeat: Infinity,
              ease: "easeInOut",
            },
          }}
        >
          {/* Breathing and hover live on two nested nodes rather than one.
              Framer owns the inline transform on each, so a single node would
              force the two to fight — and returning from a hover value to a
              keyframe array snaps, because keyframes restart at their first
              value. Nested, the scales simply multiply: idle peaks at 1.045,
              hover reaches ~1.25 combined, and both directions stay smooth.
              Scale never affects layout, so nothing else in the navbar moves. */}
          <motion.div
            className="relative"
            animate={reduced || isMobile ? undefined : { scale: [1, 1.045, 1] }}
            transition={
              reduced
                ? { duration: 0 }
                : {
                    duration: IDLE.navLogoBreathe,
                    delay: LOGO_IN + 0.8,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }
            }
          >
            <motion.div
              className="relative"
              animate={{ scale: hovered && !reduced ? 1.2 : 1 }}
              transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
            >
            <img
              src={logo}
              alt="Afaq AI"
              className="
                relative

                h-[85px]
                w-auto
                object-contain
              "
            />

            {/* Light Sweep */}
            {!reduced && !isMobile && (
              <div
                className="pointer-events-none absolute inset-0 overflow-hidden"
                style={logoMask}
              >
                <motion.div
                  className="absolute inset-y-0 w-[42%] bg-gradient-to-r from-transparent via-white/75 to-transparent blur-[3px]"
                  initial={{ x: "-160%" }}
                  animate={{ x: "260%" }}
                  transition={{
                    duration: 1.15,
                    delay: LINES_IN,
                    repeat: Infinity,
                    repeatDelay: IDLE.navLogoSweep,
                    ease: "easeInOut",
                  }}
                />
              </div>
            )}
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Right Line */}
        <motion.span
          className="
            relative
            top-[10px]

            h-px
            w-[82px]

            origin-left

            bg-gradient-to-l
            from-transparent
            via-violet-400/90
            to-transparent

            transition-all
            duration-500

            group-hover:w-[96px]
          "
          initial={reduced ? { opacity: 0 } : { opacity: 0, scaleX: 0 }}
          animate={reduced ? { opacity: 1 } : { opacity: 1, scaleX: 1 }}
          transition={{
            duration: reduced ? 0.3 : 0.6,
            delay: reduced ? 0 : LINES_IN,
            ease: EASE_OUT_EXPO,
          }}
        />
      </div>

      {/* Brand.
          A <span>, not an <h1>: this component renders twice (desktop nav and
          MobileMenu), so as a heading it put two "AFAQ AI" h1s ahead of the
          Hero headline in the document outline. The page must have exactly one
          h1 and it should be the Hero. Absolutely positioned elements are
          blockified, so the rendering is byte-identical. */}
      <motion.span
        className="
          absolute

          bottom-[10px]

          left-1/2
          -translate-x-1/2

          whitespace-nowrap

          font-['Space_Grotesk']
          text-[15px]
          font-medium

          uppercase

          tracking-[0.28em]

          leading-none

          transition-all
          duration-300
        "
        initial={isMobile ? undefined : reduced ? { opacity: 0 } : { opacity: 0, y: 6 }}
        animate={isMobile ? undefined : { opacity: 1, y: 0 }}
        transition={{
          duration: reduced ? 0.3 : 0.6,
          delay: reduced ? 0 : WORDMARK_IN,
          ease: EASE_OUT_QUINT,
        }}
      >
        <span className="text-white">AFAQ</span>

        <span className="mx-2 text-[#A47CED]">AI</span>
      </motion.span>
    </Link>
  );
};

export default Logo;
