import { useCallback, useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import { EASE_OUT_EXPO, EASE_OUT_QUINT } from "../../../constants/motion";
import type { Service } from "./services.data";

/**
 * Shared surface language, declared once. Matches the Technologies card's
 * vocabulary — same border alpha, same glass fill, same violet hover — so the
 * two sections read as one system, but at a larger scale with real content
 * hierarchy inside.
 */
const SURFACE = `
  relative flex h-full flex-col overflow-hidden
  rounded-[22px] p-7 lg:p-8
  border border-white/[0.08]
  bg-white/[0.035] backdrop-blur-xl
  shadow-[0_10px_34px_rgba(6,4,18,.38)]
  transition-[border-color,background-color,box-shadow] duration-500 ease-out
  group-hover:border-violet-400/30
  group-hover:bg-white/[0.055]
  group-hover:shadow-[0_22px_54px_rgba(79,40,183,.26)]
`;

/** The icon's own framed tile — a component inside the component, which is
 *  what stops the card reading as a flat block of text. */
const ICON_TILE = `
  relative flex h-[52px] w-[52px] items-center justify-center
  rounded-[15px]
  border border-white/[0.09]
  bg-gradient-to-b from-white/[0.09] to-white/[0.02]
  shadow-[inset_0_1px_0_rgba(255,255,255,.10)]
  transition-[border-color,box-shadow] duration-500 ease-out
  group-hover:border-violet-400/35
  group-hover:shadow-[inset_0_1px_0_rgba(255,255,255,.16),0_0_22px_rgba(117,73,216,.30)]
`;

interface ServiceCardProps {
  service: Service;
  /** Grid position, used to stagger the reveal. */
  index: number;
  /** Opens the detail modal for this service. */
  onOpen: (service: Service) => void;
}

const ServiceCard = ({ service, index, onOpen }: ServiceCardProps) => {
  const { title, description, id, Icon } = service;
  const reduced = useReducedMotion() ?? false;
  const ref = useRef<HTMLDivElement>(null);

  /**
   * The spotlight follows the cursor by writing CSS custom properties directly
   * to the node. No state, so pointer movement never triggers a React render —
   * the gradient itself is painted entirely by CSS.
   */
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
    <motion.article
      ref={ref}
      onPointerMove={handlePointerMove}
      className="group relative h-full min-h-[236px] lg:min-h-[252px]"
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 26, filter: "blur(7px)" }}
      whileInView={
        reduced ? { opacity: 1 } : { opacity: 1, y: 0, filter: "blur(0px)" }
      }
      viewport={{ once: true, margin: "-70px" }}
      whileHover={reduced ? undefined : { y: -7, scale: 1.018 }}
      transition={{
        duration: reduced ? 0.3 : 0.68,
        delay: reduced ? 0 : index * 0.07,
        ease: EASE_OUT_QUINT,
        y: { duration: 0.44, ease: EASE_OUT_EXPO },
        scale: { duration: 0.44, ease: EASE_OUT_EXPO },
      }}
    >
      {/* Ambient bloom behind the card, revealed on hover */}
      <div
        aria-hidden
        className="
          pointer-events-none absolute -inset-3 -z-10 rounded-[30px]
          bg-violet-500/20 blur-2xl
          opacity-0 transition-opacity duration-500
          group-hover:opacity-100
        "
      />

      <div className={SURFACE}>
        {/* Glass sheen — implies a light source above the card so the surface
            does not read as a flat swatch. Static, so it costs nothing. */}
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
          className="
            pointer-events-none absolute inset-0
            opacity-0 transition-opacity duration-300
            group-hover:opacity-100
          "
          style={{
            background:
              "radial-gradient(260px circle at var(--mx, 50%) var(--my, 50%), rgba(164,124,237,.16), transparent 66%)",
          }}
        />

        {/* Top edge highlight — the same motif as the Hero's primary button
            and the Technologies tile */}
        <div
          aria-hidden
          className="
            pointer-events-none absolute left-8 right-8 top-0 h-px
            bg-gradient-to-r from-transparent via-white/25 to-transparent
            transition-colors duration-500
            group-hover:via-violet-300/60
          "
        />

        {/* ── Head: icon tile + editorial index ─────────────── */}
        <div className="relative flex items-start justify-between">
          <div className={ICON_TILE}>
            <Icon
              size={23}
              strokeWidth={1.6}
              className="
                text-violet-200/85
                transition-[color,filter] duration-500 ease-out
                group-hover:text-white
                group-hover:drop-shadow-[0_0_10px_rgba(164,124,237,.6)]
              "
            />
          </div>

          <span
            aria-hidden
            className="
              text-[11px] font-semibold tracking-[0.22em]
              text-white/20
              transition-colors duration-500
              group-hover:text-violet-300/50
            "
          >
            {id}
          </span>
        </div>

        {/* ── Body ──────────────────────────────────────────── */}
        <h3
          className="
            relative mt-7
            font-['Space_Grotesk']
            text-[19px] lg:text-[20px]
            font-bold tracking-[-0.015em]
            text-white
          "
        >
          {title}
        </h3>

        <p
          className="
            relative mt-3.5
            text-[14px] leading-[1.75]
            text-white/55
            transition-colors duration-500
            group-hover:text-white/70
          "
        >
          {description}
        </p>

        {/* ── Foot: hairline rule + arrow affordance ────────── */}
        <div className="relative mt-auto flex items-center gap-4 pt-7">
          <span
            aria-hidden
            className="
              h-px flex-1
              bg-gradient-to-r from-white/[0.10] to-transparent
              transition-colors duration-500
              group-hover:from-violet-400/35
            "
          />

          {/* The arrow is the affordance, so it is the control: a real button
              with an accessible name, reachable by keyboard. The whole card is
              deliberately NOT the click target — a card-sized button would
              swallow text selection and read as one huge control to a screen
              reader. */}
          <button
            type="button"
            onClick={() => onOpen(service)}
            aria-label={`View details for ${title}`}
            className="
              -m-2 shrink-0 rounded-full p-2
              text-white/35 outline-none
              transition-[color,background-color,translate] duration-500 ease-out
              hover:bg-white/[0.06] hover:text-violet-200
              focus-visible:ring-2 focus-visible:ring-violet-400/60
              group-hover:translate-x-[3px] group-hover:-translate-y-[3px]
              group-hover:text-violet-200
            "
          >
            <ArrowUpRight aria-hidden size={17} strokeWidth={2} />
          </button>
        </div>
      </div>
    </motion.article>
  );
};

export default ServiceCard;