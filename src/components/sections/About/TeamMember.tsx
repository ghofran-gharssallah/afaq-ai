import { useCallback, useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import { EASE_OUT_EXPO, EASE_OUT_QUINT } from "../../../constants/motion";
import type { TeamMember as Member } from "./team.data";

/**
 * A team node in the orbit composition.
 *
 * Shares the surface vocabulary of the Services card — same border alpha,
 * glass fill, violet hover and cursor spotlight — so the section reads as part
 * of the same system rather than a new one.
 */

const SURFACE = `
  relative flex h-full w-full items-center gap-4 overflow-hidden
  rounded-[20px] p-4 sm:p-5
  border border-white/[0.08]
  bg-white/[0.035] backdrop-blur-xl
  shadow-[0_10px_34px_rgba(6,4,18,.38)]
  transition-[border-color,background-color,box-shadow] duration-500 ease-out
  group-hover:border-violet-400/30
  group-hover:bg-white/[0.055]
  group-hover:shadow-[0_20px_50px_rgba(79,40,183,.26)]
`;

/**
 * Portrait tile. Falls back to a monogram when no photo is supplied — same
 * frame, same glow, so the composition never looks like it is missing an asset.
 */
const Portrait = ({
  member,
  size,
}: {
  member: Member;
  size: "sm" | "lg";
}) => {
  const box =
    size === "lg"
      ? "h-[74px] w-[74px] sm:h-[86px] sm:w-[86px]"
      : "h-[58px] w-[58px] sm:h-[64px] sm:w-[64px]";

  return (
    <div
      className={`
        ${box} relative shrink-0 overflow-hidden rounded-[16px]
        border border-white/[0.10]
        bg-gradient-to-b from-white/[0.10] to-white/[0.02]
        shadow-[inset_0_1px_0_rgba(255,255,255,.12)]
        transition-[border-color,box-shadow] duration-500 ease-out
        group-hover:border-violet-400/35
        group-hover:shadow-[inset_0_1px_0_rgba(255,255,255,.18),0_0_24px_rgba(117,73,216,.30)]
      `}
    >
      {member.photo ? (
        <img
          src={member.photo}
          alt={member.name}
          className="h-full w-full object-cover object-top"
        />
      ) : (
        <>
          <span
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(80% 70% at 50% 12%, rgba(117,73,216,.28), transparent 68%)",
            }}
          />
          <span
            aria-hidden
            className={`
              relative flex h-full w-full items-center justify-center
              font-['Space_Grotesk'] font-bold tracking-[0.06em]
              text-violet-100/85
              ${size === "lg" ? "text-[24px]" : "text-[19px]"}
            `}
          >
            {member.initials}
          </span>
        </>
      )}
    </div>
  );
};

interface TeamMemberProps {
  member: Member;
  index: number;
  onOpen: (member: Member) => void;
}

const TeamMemberCard = ({ member, index, onOpen }: TeamMemberProps) => {
  const reduced = useReducedMotion() ?? false;
  const ref = useRef<HTMLDivElement>(null);
  const featured = Boolean(member.featured);

  /** Cursor spotlight via CSS vars — no state, so hovering never re-renders. */
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
      className="group relative w-full"
      initial={
        reduced ? { opacity: 0 } : { opacity: 0, y: 22, filter: "blur(6px)" }
      }
      whileInView={
        reduced ? { opacity: 1 } : { opacity: 1, y: 0, filter: "blur(0px)" }
      }
      viewport={{ once: true, margin: "-70px" }}
      whileHover={reduced ? undefined : { y: -6, scale: 1.02 }}
      transition={{
        duration: reduced ? 0.3 : 0.68,
        delay: reduced ? 0 : index * 0.08,
        ease: EASE_OUT_QUINT,
        y: { duration: 0.42, ease: EASE_OUT_EXPO },
        scale: { duration: 0.42, ease: EASE_OUT_EXPO },
      }}
    >
      {/* Ambient bloom — stronger on the founder card */}
      <div
        aria-hidden
        className={`
          pointer-events-none absolute -inset-3 -z-10 rounded-[28px] blur-2xl
          transition-opacity duration-500
          ${featured ? "bg-violet-500/22 opacity-40" : "bg-violet-500/20 opacity-0"}
          group-hover:opacity-100
        `}
      />

      <button
        type="button"
        onClick={() => onOpen(member)}
        aria-label={`Open profile for ${member.name}, ${member.role}`}
        className="block w-full text-left outline-none focus-visible:ring-2 focus-visible:ring-violet-400/60 focus-visible:ring-offset-4 focus-visible:ring-offset-transparent rounded-[20px]"
      >
        <div className={SURFACE}>
          {/* Cursor spotlight */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{
              background:
                "radial-gradient(220px circle at var(--mx, 50%) var(--my, 50%), rgba(164,124,237,.16), transparent 66%)",
            }}
          />

          {/* Top edge highlight — the motif used across the site */}
          <div
            aria-hidden
            className={`
              pointer-events-none absolute left-6 right-6 top-0 h-px
              bg-gradient-to-r from-transparent to-transparent
              transition-colors duration-500
              ${featured ? "via-violet-300/45" : "via-white/25"}
              group-hover:via-violet-300/60
            `}
          />

          <Portrait member={member} size={featured ? "lg" : "sm"} />

          <div className="relative min-w-0 flex-1">
            {featured && (
              <span className="mb-1.5 inline-block rounded-full border border-violet-500/25 bg-violet-500/10 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-violet-300">
                Founder
              </span>
            )}

            <h3
              className={`
                truncate font-['Space_Grotesk'] font-bold tracking-[-0.015em] text-white
                ${featured ? "text-[18px] sm:text-[20px]" : "text-[15.5px] sm:text-[17px]"}
              `}
            >
              {member.name}
            </h3>

            <p className="mt-1 truncate text-[11.5px] font-medium uppercase tracking-[0.14em] text-violet-300/75">
              {member.shortRole}
            </p>
          </div>

          <ArrowUpRight
            aria-hidden
            size={16}
            strokeWidth={2}
            className="
              shrink-0 self-start text-white/30
              transition-[color,translate] duration-500 ease-out
              group-hover:translate-x-[3px] group-hover:-translate-y-[3px]
              group-hover:text-violet-200
            "
          />
        </div>
      </button>
    </motion.div>
  );
};

export default TeamMemberCard;