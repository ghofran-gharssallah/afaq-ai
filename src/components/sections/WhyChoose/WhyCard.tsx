import { useCallback, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";

import { EASE_OUT_EXPO, EASE_OUT_QUINT } from "../../../constants/motion";
import { useIsMobile } from "../../../hooks/useIsMobile";
import type { Feature } from "./features.data";

/**
 * One advantage, rendered at one of three weights.
 *
 * The tiers are structurally different compositions, not one card at three
 * sizes — that is what gives the section its editorial rhythm:
 *
 *   feature  large panel: index, framed icon, headline, body, long detail,
 *            plus a decorative arc and corner light
 *   medium   framed icon above a title and body
 *   compact  horizontal row: inline icon, title, single line
 */

const BASE = `
  relative h-full overflow-hidden
  border border-white/[0.08]
  bg-white/[0.035] backdrop-blur-xl max-sm:backdrop-blur-md
  transition-[border-color,background-color,box-shadow] duration-500 ease-out
  group-hover:border-violet-400/30
  group-hover:bg-white/[0.055]
`;

const ICON_TILE = `
  relative flex items-center justify-center
  rounded-[15px]
  border border-white/[0.09]
  bg-gradient-to-b from-white/[0.09] to-white/[0.02]
  shadow-[inset_0_1px_0_rgba(255,255,255,.10)]
  transition-[border-color,box-shadow] duration-500 ease-out
  group-hover:border-violet-400/35
  group-hover:shadow-[inset_0_1px_0_rgba(255,255,255,.16),0_0_22px_rgba(117,73,216,.30)]
`;

interface WhyCardProps {
  feature: Feature;
  index: number;
}

const WhyCard = ({ feature, index }: WhyCardProps) => {
  const { tier, title, description, detail, id, Icon } = feature;
  const reduced = useReducedMotion() ?? false;
  const isMobile = useIsMobile();
  const ref = useRef<HTMLDivElement>(null);

  /** Cursor spotlight through CSS vars — no state, so hover never re-renders. */
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

  const lift = tier === "compact" ? -4 : -6;

  return (
    <motion.div
      ref={ref}
      onPointerMove={handlePointerMove}
      className="group relative h-full"
      initial={
        reduced
          ? { opacity: 0 }
          : isMobile
          ? { opacity: 0, y: 14 }
          : { opacity: 0, y: 24, filter: "blur(7px)" }
      }
      whileInView={
        reduced
          ? { opacity: 1 }
          : isMobile
          ? { opacity: 1, y: 0 }
          : { opacity: 1, y: 0, filter: "blur(0px)" }
      }
      viewport={{ once: true, margin: "-70px" }}
      whileHover={reduced ? undefined : { y: lift }}
      transition={{
        duration: reduced ? 0.3 : isMobile ? 0.25 : 0.68,
        delay: reduced ? 0 : isMobile ? index * 0.02 : index * 0.07,
        ease: EASE_OUT_QUINT,
        y: { duration: 0.42, ease: EASE_OUT_EXPO },
      }}
    >
      {/* Ambient bloom — always faintly lit on the feature block */}
      <div
        aria-hidden
        className={`
          pointer-events-none absolute -inset-3 -z-10 rounded-[30px] blur-2xl
          bg-violet-500/20 transition-opacity duration-500
          ${tier === "feature" ? "opacity-35" : "opacity-0 max-sm:hidden"}
          group-hover:opacity-100
        `}
      />

      <div
        className={`
          ${BASE}
          ${tier === "compact"
            ? "flex items-center gap-4 rounded-[18px] p-5 shadow-[0_8px_26px_rgba(6,4,18,.32)]"
            : "flex flex-col rounded-[22px] shadow-[0_10px_34px_rgba(6,4,18,.38)]"}
          ${tier === "feature" ? "p-8 lg:p-10" : ""}
          ${tier === "medium" ? "p-7 lg:p-8" : ""}
          ${tier === "feature"
            ? "group-hover:shadow-[0_24px_58px_rgba(79,40,183,.28)]"
            : "group-hover:shadow-[0_18px_46px_rgba(79,40,183,.24)]"}
        `}
      >
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
            background: `radial-gradient(${
              tier === "feature" ? "340px" : "240px"
            } circle at var(--mx, 50%) var(--my, 50%), rgba(164,124,237,.16), transparent 66%)`,
          }}
        />

        {/* Top edge highlight — the site-wide motif */}
        <div
          aria-hidden
          className={`
            pointer-events-none absolute top-0 h-px
            bg-gradient-to-r from-transparent to-transparent
            transition-colors duration-500 group-hover:via-violet-300/60
            ${tier === "compact" ? "left-5 right-5 via-white/20" : "left-8 right-8 via-white/25"}
          `}
        />

        {tier === "feature" && (
          <>
            {/* Decorative arc — a quiet nod to the Hero's orbit, at a fraction
                of its weight, anchored off the corner so it reads as depth. */}
            <svg
              aria-hidden
              viewBox="0 0 400 400"
              className="pointer-events-none absolute -bottom-28 -right-24 h-[320px] w-[320px] opacity-[0.5]"
            >
              <ellipse
                cx="200"
                cy="200"
                rx="168"
                ry="168"
                fill="none"
                stroke="rgba(164,124,237,.16)"
                strokeWidth="1"
              />
              <ellipse
                cx="200"
                cy="200"
                rx="168"
                ry="72"
                fill="none"
                stroke="rgba(208,194,227,.13)"
                strokeWidth="1"
                transform="rotate(-28 200 200)"
              />
            </svg>
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(58% 46% at 88% 92%, rgba(117,73,216,.16), transparent 66%)",
              }}
            />
          </>
        )}

        {/* ── Compact row ─────────────────────────────────── */}
        {tier === "compact" ? (
          <>
            <span className={`${ICON_TILE} h-[42px] w-[42px] shrink-0`}>
              <Icon
                size={19}
                strokeWidth={1.7}
                className="text-violet-200/85 transition-colors duration-500 group-hover:text-white"
              />
            </span>
            <div className="relative min-w-0">
              <h3 className="font-['Space_Grotesk'] text-[15.5px] font-bold tracking-[-0.01em] text-white">
                {title}
              </h3>
              <p className="mt-1 text-[13px] leading-[1.6] text-white/50 transition-colors duration-500 group-hover:text-white/65">
                {description}
              </p>
            </div>
          </>
        ) : (
          /* ── Feature and medium ───────────────────────── */
          <>
            <div className="relative flex items-start justify-between">
              <span
                className={`${ICON_TILE} ${
                  tier === "feature"
                    ? "h-[58px] w-[58px]"
                    : "h-[50px] w-[50px]"
                }`}
              >
                <Icon
                  size={tier === "feature" ? 26 : 22}
                  strokeWidth={1.6}
                  className="text-violet-200/85 transition-[color,filter] duration-500 group-hover:text-white group-hover:drop-shadow-[0_0_10px_rgba(164,124,237,.6)]"
                />
              </span>

              <span
                aria-hidden
                className="text-[11px] font-semibold tracking-[0.22em] text-white/20 transition-colors duration-500 group-hover:text-violet-300/50"
              >
                {id}
              </span>
            </div>

            <h3
              className={`
                relative font-['Space_Grotesk'] font-bold tracking-[-0.02em] text-white
                ${tier === "feature"
                  ? "mt-8 text-[24px] lg:text-[29px]"
                  : "mt-7 text-[18px] lg:text-[19px]"}
              `}
            >
              {title}
            </h3>

            <p
              className={`
                relative text-white/60 transition-colors duration-500 group-hover:text-white/72
                ${tier === "feature"
                  ? "mt-4 max-w-[440px] text-[15px] leading-[1.8] lg:text-[16px]"
                  : "mt-3.5 text-[14px] leading-[1.75]"}
              `}
            >
              {description}
            </p>

            {tier === "feature" && detail && (
              <>
                <span
                  aria-hidden
                  className="relative mt-8 block h-px w-full max-w-[420px] bg-gradient-to-r from-violet-400/30 to-transparent"
                />
                <p className="relative mt-6 max-w-[440px] text-[14px] leading-[1.85] text-white/45">
                  {detail}
                </p>
              </>
            )}

            {tier === "feature" && <div className="flex-1" />}
          </>
        )}
      </div>
    </motion.div>
  );
};

export default WhyCard;