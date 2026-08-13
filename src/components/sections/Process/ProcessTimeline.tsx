import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";

import ProcessCard from "./ProcessCard";
import { PROCESS } from "./process.data";

/**
 * The journey rail.
 *
 * A single hairline runs the height of the sequence with a violet fill that
 * tracks scroll progress through the section, and each milestone node lights
 * as the fill reaches it. That is what turns a list of six steps into a
 * journey the eye follows — and it is driven entirely by transform/opacity on
 * MotionValues, so it never triggers a React render while scrolling.
 *
 * Layout:
 *   md+   rail centred, cards alternating either side
 *   sm    rail pinned to the far left, cards in a single right-hand column —
 *         a different composition, not the desktop one squashed
 */

const NODE_LEAD = 0.35; // how early in its row a node lights, 0..1

/** One milestone marker on the rail. */
const Node = ({
  progress,
  threshold,
  reduced,
}: {
  progress: MotionValue<number>;
  threshold: number;
  reduced: boolean;
}) => {
  // Lights over a short window ending at its own threshold.
  const lit = useTransform(
    progress,
    [Math.max(0, threshold - 0.09), threshold],
    [0, 1]
  );
  const scale = useTransform(lit, [0, 1], [0.82, 1]);

  return (
    <span
      aria-hidden
      className="pointer-events-none absolute left-[19px] top-[52px] z-10 -translate-x-1/2 md:left-1/2"
    >
      <span className="relative flex h-[15px] w-[15px] items-center justify-center">
        {/* Resting ring */}
        <span className="absolute inset-0 rounded-full border border-white/15 bg-[#060612]" />

        {/* Lit state */}
        <motion.span
          className="absolute inset-0 rounded-full border border-violet-300/70"
          style={reduced ? { opacity: 1 } : { opacity: lit, scale }}
        />
        <motion.span
          className="absolute -inset-[7px] rounded-full bg-violet-500/35 blur-[7px]"
          style={reduced ? { opacity: 1 } : { opacity: lit }}
        />
        <motion.span
          className="relative h-[5px] w-[5px] rounded-full bg-violet-200"
          style={reduced ? { opacity: 1 } : { opacity: lit }}
        />
      </span>
    </span>
  );
};

const ProcessTimeline = () => {
  const reduced = useReducedMotion() ?? false;
  const ref = useRef<HTMLDivElement>(null);

  /** 0 as the sequence enters, 1 as it leaves. */
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 72%", "end 72%"],
  });

  // Softened so the fill glides rather than tracking the wheel exactly.
  const progress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 26,
    restDelta: 0.001,
  });

  return (
    <div ref={ref} className="relative">
      {/* ── Rail ───────────────────────────────────────────── */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-[64px] top-[52px] left-[19px] w-px -translate-x-1/2 md:left-1/2"
      >
        {/* Unlit track, faded at both ends so it has no hard terminals */}
        <span
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, transparent, rgba(255,255,255,.10) 8%, rgba(255,255,255,.10) 92%, transparent)",
          }}
        />

        {/* Scroll-linked fill */}
        <motion.span
          className="absolute inset-0 origin-top"
          style={{
            scaleY: reduced ? 1 : progress,
            background:
              "linear-gradient(to bottom, rgba(164,124,237,.65), rgba(117,73,216,.45))",
            boxShadow: "0 0 12px rgba(117,73,216,.45)",
          }}
        />
      </div>

      {/* ── Milestones ─────────────────────────────────────── */}
      <div className="flex flex-col gap-8 md:gap-12 lg:gap-14">
        {PROCESS.map((step, i) => {
          const side = i % 2 === 0 ? "left" : "right";
          const threshold = (i + NODE_LEAD) / PROCESS.length;

          return (
            <div
              key={step.id}
              className="relative grid md:grid-cols-2 md:gap-x-16 lg:gap-x-20"
            >
              <Node
                progress={progress}
                threshold={threshold}
                reduced={reduced}
              />

              <div
                className={`
                  pl-12 sm:pl-14 md:pl-0
                  ${side === "left"
                    ? "md:col-start-1 md:pr-2"
                    : "md:col-start-2 md:pl-2"}
                `}
              >
                <ProcessCard step={step} index={i} side={side} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProcessTimeline;
