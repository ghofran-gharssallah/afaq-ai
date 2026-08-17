import { useEffect, useRef } from "react";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "framer-motion";

import { EASE_OUT_EXPO } from "../../../constants/motion";
import { useIsMobile } from "../../../hooks/useIsMobile";
import { STATS, type Stat } from "./features.data";

/**
 * The stat band.
 *
 * Numbers count up via a Framer MotionValue rather than React state: the value
 * is driven outside the render loop and written straight to the DOM node, so a
 * 1.6s count costs zero re-renders. Reduced motion skips the count and shows
 * the final figure immediately.
 */
const Counter = ({ stat, play }: { stat: Stat; play: boolean }) => {
  const reduced = useReducedMotion() ?? false;
  const target = stat.value ?? 0;

  const count = useMotionValue(reduced ? target : 0);
  const rounded = useTransform(count, (v) => Math.round(v).toString());

  useEffect(() => {
    if (!play || reduced || stat.value === null) return;
    const controls = animate(count, target, {
      duration: 1.7,
      ease: EASE_OUT_EXPO,
    });
    return () => controls.stop();
  }, [play, reduced, target, count, stat.value]);

  // Non-numeric figures (e.g. "24/7") are rendered verbatim.
  if (stat.value === null) return <span>{stat.display}</span>;

  return (
    <span className="tabular-nums">
      <motion.span>{rounded}</motion.span>
      {stat.suffix}
    </span>
  );
};

const Stats = () => {
  const reduced = useReducedMotion() ?? false;
  const isMobile = useIsMobile();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      className="
        relative overflow-hidden rounded-[24px]
        border border-white/[0.08]
        bg-white/[0.03] backdrop-blur-xl max-sm:backdrop-blur-md
        shadow-[0_14px_44px_rgba(6,4,18,.36)]
      "
      initial={
        reduced
          ? { opacity: 0 }
          : isMobile
          ? { opacity: 0, y: 14 }
          : { opacity: 0, y: 26, filter: "blur(8px)" }
      }
      whileInView={
        reduced
          ? { opacity: 1 }
          : isMobile
          ? { opacity: 1, y: 0 }
          : { opacity: 1, y: 0, filter: "blur(0px)" }
      }
      viewport={{ once: true, margin: "-70px" }}
      transition={{
        duration: reduced ? 0.3 : isMobile ? 0.45 : 0.75,
        ease: EASE_OUT_EXPO,
      }}
    >
      {/* Interior key light + top edge highlight, matching the cards */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(80% 120% at 50% -20%, rgba(117,73,216,.14), transparent 64%)",
        }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute left-16 right-16 top-0 h-px bg-gradient-to-r from-transparent via-violet-300/40 to-transparent"
      />

      <dl className="relative grid grid-cols-2 lg:grid-cols-4">
        {STATS.map((stat, i) => (
          <div
            key={stat.label}
            className={`
              relative flex flex-col items-center justify-center gap-2
              px-5 py-9 text-center sm:py-11
              ${i % 2 === 1 ? "border-l border-white/[0.06]" : ""}
              ${i >= 2 ? "border-t border-white/[0.06] lg:border-t-0" : ""}
              ${i > 0 ? "lg:border-l lg:border-white/[0.06]" : ""}
            `}
          >
            <dd className="font-['Space_Grotesk'] text-[30px] font-bold tracking-[-0.03em] text-white sm:text-[38px] lg:text-[42px]">
              <Counter stat={stat} play={inView} />
            </dd>
            <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-violet-300/65 sm:text-[11.5px]">
              {stat.label}
            </dt>
          </div>
        ))}
      </dl>
    </motion.div>
  );
};

export default Stats;