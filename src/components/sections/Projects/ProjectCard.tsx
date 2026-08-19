import { useCallback, useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import { EASE_OUT_EXPO, EASE_OUT_QUINT } from "../../../constants/motion";
import { useIsMobile } from "../../../hooks/useIsMobile";
import ProjectCover from "./ProjectCover";
import type { Project } from "./projects.data";

/**
 * A featured case study.
 *
 * Two compositions from one component, so the pair reads as an editorial
 * spread rather than a repeated card:
 *
 *   stacked  full-bleed cover across the top, then a two-column footer —
 *            identity on the left, stack and CTA on the right
 *   split    cover beside the content on a 12-column grid, cover on the
 *            right so the eye crosses back over the page
 *
 * Only the "View Case Study" control opens the modal. The panel itself is not
 * a button: a card-sized control swallows text selection and announces as one
 * enormous target to a screen reader.
 */

const SURFACE = `
  relative overflow-hidden rounded-[26px]
  border border-white/[0.08]
  bg-white/[0.03] backdrop-blur-xl max-sm:backdrop-blur-md
  shadow-[0_14px_44px_rgba(6,4,18,.40)]
  transition-[border-color,background-color,box-shadow] duration-500 ease-out
  group-hover:border-violet-400/28
  group-hover:bg-white/[0.05]
  group-hover:shadow-[0_26px_64px_rgba(79,40,183,.26)]
`;

const TECH_CHIP = `
  rounded-full border border-white/[0.09] bg-white/[0.04]
  px-3.5 py-1.5 text-[12px] font-medium text-white/65
  shadow-[inset_0_1px_0_rgba(255,255,255,.06)]
  transition-colors duration-300
  group-hover:border-violet-400/20
`;

interface ProjectCardProps {
  project: Project;
  index: number;
  onOpen: (project: Project) => void;
}

const ProjectCard = ({ project, index, onOpen }: ProjectCardProps) => {
  const { variant, index: numeral, category, title, description, tech } = project;
  const reduced = useReducedMotion() ?? false;
  const isMobile = useIsMobile();
  const ref = useRef<HTMLDivElement>(null);
  const split = variant === "split";

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

  /* ── Shared content pieces ──────────────────────────────── */

  const Identity = (
    <div className="min-w-0">
      <div className="flex items-center gap-3">
        <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-violet-300/75">
          {category}
        </span>
        <span aria-hidden className="h-px w-8 bg-violet-400/25" />
        <span
          aria-hidden
          className="text-[11px] font-semibold tracking-[0.22em] text-white/20"
        >
          {numeral}
        </span>
      </div>

      <h3
        className={`
          mt-4 font-['Space_Grotesk'] font-bold tracking-[-0.025em] text-white
          ${split ? "text-[22px] lg:text-[26px]" : "text-[24px] lg:text-[30px]"}
        `}
      >
        {title}
      </h3>

      <p
        className={`
          mt-4 text-[14.5px] leading-[1.8] text-white/60
          transition-colors duration-500 group-hover:text-white/72
          ${split ? "" : "max-w-[560px]"}
        `}
      >
        {description}
      </p>
    </div>
  );

  const Stack = (
    <ul className="flex flex-wrap gap-2">
      {tech.map((t) => (
        <li key={t} className={TECH_CHIP}>
          {t}
        </li>
      ))}
    </ul>
  );

  const Cta = (
    <button
      type="button"
      onClick={() => onOpen(project)}
      className="
        group/cta inline-flex items-center gap-2.5 rounded-full
        border border-white/12 bg-white/[0.04] px-6 py-3
        text-[13.5px] font-semibold text-white outline-none
        backdrop-blur-xl max-sm:backdrop-blur-md
        transition-all duration-300
        hover:border-violet-400/40 hover:bg-white/[0.07]
        focus-visible:ring-2 focus-visible:ring-violet-400/60
      "
    >
      View Case Study
      <ArrowUpRight
        aria-hidden
        size={16}
        strokeWidth={2}
        className="
          text-violet-200/80
          transition-[translate,color] duration-300 ease-out
          group-hover/cta:translate-x-[3px] group-hover/cta:-translate-y-[3px]
          group-hover/cta:text-violet-100
        "
      />
    </button>
  );

  return (
    <motion.article
      ref={ref}
      onPointerMove={handlePointerMove}
      className="group relative"
      initial={
        reduced
          ? { opacity: 0 }
          : isMobile
          ? { opacity: 0, y: 16 }
          : { opacity: 0, y: 30, filter: "blur(8px)" }
      }
      whileInView={
        reduced
          ? { opacity: 1 }
          : isMobile
          ? { opacity: 1, y: 0 }
          : { opacity: 1, y: 0, filter: "blur(0px)" }
      }
      viewport={{ once: true, margin: "-80px" }}
      whileHover={reduced ? undefined : { y: -6 }}
      transition={{
        duration: reduced ? 0.3 : isMobile ? 0.27 : 0.75,
        delay: reduced ? 0 : isMobile ? index * 0.035 : index * 0.12,
        ease: EASE_OUT_QUINT,
        y: { duration: 0.45, ease: EASE_OUT_EXPO },
      }}
    >
      {/* Ambient bloom */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-4 -z-10 rounded-[36px] bg-violet-500/18 opacity-0 max-sm:hidden blur-3xl transition-opacity duration-500 group-hover:opacity-100"
      />

      <div className={SURFACE}>
        {/* Cursor spotlight */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(420px circle at var(--mx, 50%) var(--my, 50%), rgba(164,124,237,.12), transparent 66%)",
          }}
        />

        {/* Top edge highlight — the site-wide motif */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-10 right-10 top-0 z-10 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent transition-colors duration-500 group-hover:via-violet-300/60"
        />

        {split ? (
          /* ── Split: content left, cover right ─────────────── */
          <div className="grid items-center gap-8 p-6 sm:p-8 lg:grid-cols-12 lg:gap-10 lg:p-10">
            <div className="flex flex-col gap-7 lg:col-span-5">
              {Identity}
              {Stack}
              <div>{Cta}</div>
            </div>

            <div className="lg:col-span-7">
              <ProjectCover
                project={project}
                className="aspect-[16/10] w-full lg:aspect-[16/11]"
              />
            </div>
          </div>
        ) : (
          /* ── Stacked: full-bleed cover, then a two-column foot ─ */
          <div className="flex flex-col">
            <ProjectCover
              project={project}
              className="aspect-[16/9] w-full rounded-none border-0 sm:aspect-[2.3/1]"
            />

            <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-12 lg:gap-10 lg:p-10">
              <div className="lg:col-span-7">{Identity}</div>

              <div className="flex flex-col justify-between gap-7 lg:col-span-5 lg:items-end">
                {Stack}
                <div>{Cta}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.article>
  );
};

export default ProjectCard;
