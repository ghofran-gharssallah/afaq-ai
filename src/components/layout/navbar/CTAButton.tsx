import { CalendarDays } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import {
  D,
  EASE_OUT_BACK_SOFT,
  T,
} from "../../../constants/motion";
import { leftLinks, rightLinks } from "../../../constants/navigation";
import { BOOKING_URL } from "../../../config/booking";

interface CTAButtonProps {
  /**
   * Skip the page-load entrance choreography and render already-settled.
   * The delay/scale-in below is timed to land after the desktop nav links
   * on first paint; reused as-is inside something that mounts fresh on
   * every open — the mobile nav panel — it would replay that same ~0.85s
   * delay each time and leave the button invisible until it elapses.
   */
  immediate?: boolean;
}

const CTAButton = ({ immediate = false }: CTAButtonProps) => {
  const reduced = useReducedMotion();
  const skip = immediate || reduced;

  /** Lands immediately after the last nav link, as in the reference. */
  const delay = T.navItems + (leftLinks.length + rightLinks.length) * T.navItemStagger;

  return (
    <motion.div
      className="inline-flex"
      initial={skip ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.72, y: -8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        duration: skip ? 0 : D.navItem,
        delay: skip ? 0 : delay,
        ease: EASE_OUT_BACK_SOFT,
      }}
    >
    <a
      href={BOOKING_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="
        group
        relative

        inline-flex
        items-center
        justify-center
        gap-2.5

        h-[32px]
        min-w-[150px]
        px-[34px]

        rounded-full
        overflow-hidden

        transition-all
        duration-300
        ease-out

        hover:scale-[1.03]

        outline-none
        focus-visible:ring-2
        focus-visible:ring-violet-400/60
      "
    >
      {/* Purple Glow */}
      <div
        className="
          absolute
          -inset-[3px]

          rounded-full

          bg-violet-500/30

          blur-xl

          opacity-55

          transition-all
          duration-300

          group-hover:opacity-90
          group-hover:blur-2xl
        "
      />

      {/* Background */}
      <div
        className="
          absolute
          inset-0

          rounded-full

          border
          border-[#D0C2E366]

          bg-[radial-gradient(circle_at_78%_25%,rgba(117,73,216,.45)_0%,transparent_30%),linear-gradient(90deg,#01010A_0%,#060612_20%,#29126E_48%,#4F28B7_72%,#7549D8_100%)]

          shadow-[inset_0_1px_0_rgba(255,255,255,.28),inset_0_-8px_12px_rgba(18,10,58,.45),0_10px_24px_rgba(117,73,216,.12)]
        "
      />

      {/* Top Highlight */}
      <div
        className="
          absolute

          top-[1px]
          left-[9px]
          right-[9px]

          h-[7px]

          rounded-full

          bg-gradient-to-r
          from-transparent
          via-white/55
          to-transparent

          opacity-80
        "
      />

      {/* Inner Purple Light */}
      <div
        className="
          absolute
          inset-[1px]

          rounded-full

          bg-[radial-gradient(circle_at_80%_50%,rgba(255,255,255,.08),transparent_55%)]

          opacity-80
        "
      />

      {/* Icon */}
      <CalendarDays
        size={15}
        strokeWidth={2.2}
        className="
          relative
          z-10

          text-white

          transition-all
          duration-300

          drop-shadow-[0_0_4px_rgba(255,255,255,.25)]

          group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,.45)]
        "
      />

      {/* Text */}
      <span
        className="
          relative
          z-10

          whitespace-nowrap

          font-['Inter']

          text-[14px]
          font-semibold

          tracking-[-0.01em]

          text-white

          transition-all
          duration-300

          drop-shadow-[0_0_4px_rgba(255,255,255,.15)]

          group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,.35)]
        "
      >
        Book a Call
      </span>
    </a>
    </motion.div>
  );
};

export default CTAButton;