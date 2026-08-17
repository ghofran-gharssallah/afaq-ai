import { motion, useReducedMotion } from "framer-motion";

import logo from "../../../assets/logo/logo.png";
import { EASE_OUT_EXPO } from "../../../constants/motion";
import { useMediaQuery } from "../../../hooks/useIsMobile";
import TeamMemberCard from "./TeamMember";
import { TEAM, type TeamMember } from "./team.data";

/** Matches the `md:` (768px) split every class below already uses. */
const MOBILE_QUERY = "(max-width: 767px)";

/**
 * The team composition.
 *
 * Desktop is a three-track arrangement — two members, the core, two members —
 * with the outer columns counter-staggered vertically so the group reads as
 * orbiting a centre rather than sitting in a row. Hairlines run from the core
 * out to each side to make the relationship explicit.
 *
 * The core is deliberately restrained: two thin elliptical arcs and a glow,
 * NOT a second copy of the Hero's ring system. The Hero owns that motif;
 * repeating it at full strength here would read as a duplicate rather than a
 * counterpart.
 *
 * Mobile is a separate composition, not a stack: the core sits at the top at
 * reduced scale and the members fall into a two-column grid beneath it, with
 * the founder spanning the full width to keep its hierarchy.
 */

const Core = () => {
  const reduced = useReducedMotion() ?? false;

  return (
    <motion.div
      className="relative flex items-center justify-center"
      initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.86 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: reduced ? 0.3 : 0.9, ease: EASE_OUT_EXPO }}
    >
      <div className="relative h-[190px] w-[190px] lg:h-[230px] lg:w-[230px]">
        {/* Volumetric core glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-[45%] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(117,73,216,.30) 0%, rgba(79,40,183,.12) 40%, transparent 70%)",
          }}
        />

        {/* Two restrained arcs. Counter-rotating, very slow, very faint. */}
        <svg
          viewBox="0 0 240 240"
          className="absolute inset-0 h-full w-full overflow-visible"
          aria-hidden
        >
          <motion.g
            style={{ transformOrigin: "120px 120px" }}
            animate={reduced ? undefined : { rotate: 360 }}
            transition={{ duration: 46, repeat: Infinity, ease: "linear" }}
          >
            <ellipse
              cx="120"
              cy="120"
              rx="112"
              ry="46"
              fill="none"
              stroke="rgba(208,194,227,.26)"
              strokeWidth="1"
            />
            <circle cx="232" cy="120" r="2.6" fill="rgba(245,242,249,.9)" />
          </motion.g>

          <motion.g
            style={{ transformOrigin: "120px 120px" }}
            animate={reduced ? undefined : { rotate: -360 }}
            transition={{ duration: 62, repeat: Infinity, ease: "linear" }}
          >
            <ellipse
              cx="120"
              cy="120"
              rx="52"
              ry="110"
              fill="none"
              stroke="rgba(164,124,237,.20)"
              strokeWidth="1"
            />
            <circle cx="120" cy="10" r="2.2" fill="rgba(245,242,249,.75)" />
          </motion.g>
        </svg>

        {/* Mark */}
        <motion.img
          src={logo}
          alt=""
          aria-hidden
          className="absolute left-1/2 top-1/2 w-[96px] -translate-x-1/2 -translate-y-1/2 select-none lg:w-[118px]"
          style={{ filter: "drop-shadow(0 0 34px rgba(79,40,183,.55))" }}
          animate={reduced ? undefined : { y: [0, -7, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    </motion.div>
  );
};

/** Hairline from the core out to a member column. */
const Tether = ({ side }: { side: "left" | "right" }) => (
  <span
    aria-hidden
    className={`
      pointer-events-none absolute top-1/2 hidden h-px w-[clamp(28px,5vw,72px)] lg:block
      ${side === "left"
        ? "right-full bg-gradient-to-l from-violet-400/30 to-transparent"
        : "left-full bg-gradient-to-r from-violet-400/30 to-transparent"}
    `}
  />
);

interface TeamOrbitProps {
  onOpen: (member: TeamMember) => void;
}

const TeamOrbit = ({ onOpen }: TeamOrbitProps) => {
  // Left track carries the founder; right track the other two.
  const left = [TEAM[0], TEAM[2]];
  const right = [TEAM[1], TEAM[3]];

  /**
   * `Core` runs three continuous Framer Motion loops (two counter-rotating
   * arcs, one floating mark — all `repeat: Infinity`, driven by Framer's own
   * rAF engine, not CSS). Both compositions below used to always mount and
   * merely go `display:none` by breakpoint, so on mobile the entire desktop
   * orbit — including its own separate `Core` — kept animating invisibly for
   * as long as the About page stayed open. Conditionally rendering only the
   * visible composition actually unmounts, and stops, the other one.
   */
  const isMobile = useMediaQuery(MOBILE_QUERY);

  return (
    <>
      {/* ── Desktop / tablet: orbit arrangement ───────────────── */}
      {!isMobile && (
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-8 lg:gap-12">
          <div className="flex flex-col gap-6 lg:translate-y-8 lg:gap-8">
            {left.map((m, i) => (
              <TeamMemberCard key={m.id} member={m} index={i} onOpen={onOpen} />
            ))}
          </div>

          <div className="relative">
            <Tether side="left" />
            <Core />
            <Tether side="right" />
          </div>

          <div className="flex flex-col gap-6 lg:-translate-y-8 lg:gap-8">
            {right.map((m, i) => (
              <TeamMemberCard
                key={m.id}
                member={m}
                index={i + 1}
                onOpen={onOpen}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── Mobile: core above, then every card in a single column ─ */}
      {isMobile && (
        <div>
          <div className="flex justify-center">
            <div className="scale-[0.82] origin-top">
              <Core />
            </div>
          </div>

          <div className="mt-2 flex flex-col gap-3.5">
            {TEAM.map((m, i) => (
              <TeamMemberCard key={m.id} member={m} index={i} onOpen={onOpen} />
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default TeamOrbit;