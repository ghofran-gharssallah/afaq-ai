import { useCallback, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";

import { EASE_OUT_EXPO, EASE_OUT_QUINT } from "../../../constants/motion";
import { useIsMobile } from "../../../hooks/useIsMobile";
import type { ProcessStep } from "./process.data";

/**
 * One milestone.
 *
 * The step number is set as a large ghosted numeral bled off the card's inner
 * edge — a typographic element rather than a badge. It is what carries the
 * sequence visually, so the card itself does not need a stepper chrome.
 *
 * `side` mirrors the composition on alternating rows so the numeral always
 * sits on the outer edge, away from the rail.
 */

const SURFACE = `
  relative overflow-hidden rounded-[22px] p-7 lg:p-8
  border border-white/[0.08]
  bg-white/[0.035] backdrop-blur-xl max-sm:backdrop-blur-md
  shadow-[0_10px_34px_rgba(6,4,18,.38)]
  transition-[border-color,background-color,box-shadow] duration-500 ease-out
  group-hover:border-violet-400/30
  group-hover:bg-white/[0.055]
  group-hover:shadow-[0_20px_50px_rgba(79,40,183,.26)]
`;

const ICON_TILE = `
  relative flex h-[48px] w-[48px] items-center justify-center rounded-[14px]
  border border-white/[0.09]
  bg-gradient-to-b from-white/[0.09] to-white/[0.02]
  shadow-[inset_0_1px_0_rgba(255,255,255,.10)]
  transition-[border-color,box-shadow] duration-500 ease-out
  group-hover:border-violet-400/35
  group-hover:shadow-[inset_0_1px_0_rgba(255,255,255,.16),0_0_22px_rgba(117,73,216,.30)]
`;

interface ProcessCardProps {
  step: ProcessStep;
  index: number;
  /** Which side of the rail this card sits on (desktop only). */
  side: "left" | "right";
}

const ProcessCard = ({ step, index, side }: ProcessCardProps) => {
  const { id, title, description, note, Icon } = step;
  const reduced = useReducedMotion() ?? false;
  const isMobile = useIsMobile();
  const ref = useRef<HTMLDivElement>(null);

  /** Cursor spotlight via CSS vars — no state, so hover never re-renders. */
  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${e.clientX - r.left}px`);
      el.style.setProperty("--my", `${e.clientY - r.top}px`);
    },
    []
  );

  return (
    <motion.div
      ref={ref}
      onPointerMove={handlePointerMove}
      className="group relative"
      // Mobile: no initial/whileInView/viewport at all — no observer, no
      // animation subscription. Desktop keeps the original entrance exactly.
      initial={
        isMobile
          ? undefined
          : reduced
          ? { opacity: 0 }
          : { opacity: 0, y: 26, x: side === "left" ? 14 : -14, filter: "blur(7px)" }
      }
      whileInView={
        isMobile
          ? undefined
          : reduced
          ? { opacity: 1 }
          : { opacity: 1, y: 0, x: 0, filter: "blur(0px)" }
      }
      viewport={isMobile ? undefined : { once: true, margin: "-80px" }}
      whileHover={reduced ? undefined : { y: -6 }}
      transition={{
        duration: reduced ? 0.3 : 0.7,
        delay: reduced ? 0 : index * 0.05,
        ease: EASE_OUT_QUINT,
        y: { duration: 0.42, ease: EASE_OUT_EXPO },
      }}
    >
      {/* Ambient bloom */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-3 -z-10 rounded-[30px] bg-violet-500/20 opacity-0 max-sm:hidden blur-2xl transition-opacity duration-500 group-hover:opacity-100"
      />

      <div className={SURFACE}>
        {/* Ghosted numeral — the sequence carrier. Bled off the outer edge so
            it reads as a watermark rather than a label. */}
        <span
          aria-hidden
          className={`
            pointer-events-none absolute -top-5 select-none
            font-['Space_Grotesk'] text-[104px] font-bold leading-none tracking-[-0.06em]
            text-white/[0.045]
            transition-colors duration-500 group-hover:text-violet-300/[0.10]
            lg:text-[124px]
            ${
              /* Always on the card's OUTER edge, away from the rail. On mobile
                 every card sits right of a far-left rail, so outer is right;
                 from md the left-hand cards flip their numeral to the left. */
              side === "left"
                ? "-right-3 md:left-[-14px] md:right-auto"
                : "-right-3"
            }
          `}
        >
          {id}
        </span>

        {/* Glass sheen */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 76% at 50% -18%, rgba(255,255,255,.07), transparent 60%)",
          }}
        />

        {/* Cursor spotlight */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(280px circle at var(--mx, 50%) var(--my, 50%), rgba(164,124,237,.16), transparent 66%)",
          }}
        />

        {/* Top edge highlight — the site-wide motif */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-8 right-8 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent transition-colors duration-500 group-hover:via-violet-300/60"
        />

        <div className="relative flex items-center gap-4">
          <span className={ICON_TILE}>
            <Icon
              size={21}
              strokeWidth={1.6}
              className="text-violet-200/85 transition-[color,filter] duration-500 group-hover:text-white group-hover:drop-shadow-[0_0_10px_rgba(164,124,237,.6)]"
            />
          </span>

          <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-violet-300/60">
            Step {id}
          </span>
        </div>

        <h3 className="relative mt-6 font-['Space_Grotesk'] text-[20px] font-bold tracking-[-0.02em] text-white lg:text-[22px]">
          {title}
        </h3>

        <p className="relative mt-3 text-[14.5px] leading-[1.75] text-white/60 transition-colors duration-500 group-hover:text-white/72">
          {description}
        </p>

        <span
          aria-hidden
          className="relative mt-6 block h-px w-full bg-gradient-to-r from-white/[0.10] to-transparent transition-colors duration-500 group-hover:from-violet-400/35"
        />

        <p className="relative mt-4 text-[13px] leading-[1.7] text-white/40">
          {note}
        </p>
      </div>
    </motion.div>
  );
};

export default ProcessCard;
