import { useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { CalendarDays, Check, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import logo from "../../../assets/logo/logo.png";
import { EASE_OUT_EXPO } from "../../../constants/motion";
import ProjectCover from "./ProjectCover";
import type { Project } from "./projects.data";

/**
 * Case-study modal.
 *
 * Same shell as the Services and Team modals: portalled to document.body
 * because the section clips its overflow and sits under transformed
 * ancestors, and the page behind is blurred with a full-viewport
 * backdrop-filter rather than by filtering the page root, which would create
 * a containing block for the fixed Navbar and Background.
 */

/** Reproduces the Hero/Navbar CTA exactly — same layered glow and gradient. */
const PrimaryButton = ({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
}) => (
  <a
    href="#contact"
    onClick={onClick}
    className="group relative inline-flex h-[44px] min-w-[184px] items-center justify-center gap-2.5 overflow-hidden rounded-full px-[32px] transition-all duration-300 ease-out hover:scale-[1.03]"
  >
    <span className="absolute -inset-[3px] rounded-full bg-violet-500/30 blur-xl opacity-55 transition-all duration-300 group-hover:opacity-90 group-hover:blur-2xl" />
    <span className="absolute inset-0 rounded-full border border-[#D0C2E366] bg-[radial-gradient(circle_at_78%_25%,rgba(164,124,237,.45)_0%,transparent_30%),linear-gradient(90deg,#060612_0%,#14093A_20%,#3A1C91_48%,#7549D8_72%,#A47CED_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,.28),inset_0_-8px_12px_rgba(18,10,58,.45),0_10px_24px_rgba(117,73,216,.12)]" />
    <span className="absolute left-[9px] right-[9px] top-[1px] h-[7px] rounded-full bg-gradient-to-r from-transparent via-white/55 to-transparent opacity-80" />
    <span className="absolute inset-[1px] rounded-full bg-[radial-gradient(circle_at_80%_50%,rgba(255,255,255,.08),transparent_55%)] opacity-80" />
    <CalendarDays size={15} strokeWidth={2.2} className="relative z-10 text-white" />
    <span className="relative z-10 whitespace-nowrap text-[14.5px] font-semibold tracking-[-0.01em] text-white drop-shadow-[0_0_4px_rgba(255,255,255,.15)] transition-all duration-300 group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,.35)]">
      {children}
    </span>
  </a>
);

/** Section label — one definition for every block in the body. */
const Block = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <section>
    <h4 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-violet-300/70">
      {label}
    </h4>
    <div className="mt-4">{children}</div>
  </section>
);

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

const ProjectModal = ({ project, onClose }: ProjectModalProps) => {
  const reduced = useReducedMotion() ?? false;
  const panelRef = useRef<HTMLDivElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);
  const open = Boolean(project);

  /**
   * Closes the modal and hands off to the native "#contact" anchor jump —
   * but the modal locks html/body scroll while open, so a same-tick jump
   * would land while the page still can't move. Waiting a frame lets the
   * close effect's cleanup restore scrolling first.
   */
  const goToContact = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      onClose();
      requestAnimationFrame(() => {
        document
          .getElementById("contact")
          ?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
      });
    },
    [onClose, reduced]
  );

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;
      const f = panelRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (!f.length) return;
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (!open) return;
    restoreRef.current = document.activeElement as HTMLElement | null;

    // <html> is the scrolling element here, so both must be locked or the page
    // still scrolls behind the dialog.
    const { body, documentElement } = document;
    const gutter = window.innerWidth - documentElement.clientWidth;
    const prevBody = body.style.overflow;
    const prevHtml = documentElement.style.overflow;
    const prevPad = body.style.paddingRight;
    body.style.overflow = "hidden";
    documentElement.style.overflow = "hidden";
    if (gutter > 0) body.style.paddingRight = `${gutter}px`;

    document.addEventListener("keydown", onKeyDown);
    const raf = requestAnimationFrame(() => panelRef.current?.focus());

    return () => {
      body.style.overflow = prevBody;
      documentElement.style.overflow = prevHtml;
      body.style.paddingRight = prevPad;
      document.removeEventListener("keydown", onKeyDown);
      cancelAnimationFrame(raf);
      restoreRef.current?.focus?.();
    };
  }, [open, onKeyDown]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open && project && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto overscroll-contain p-4 sm:p-6 lg:p-8">
          <motion.div
            className="fixed inset-0 bg-[#01010A]/72 backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0.15 : 0.35, ease: "easeOut" }}
            onClick={onClose}
          />

          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-modal-title"
            tabIndex={-1}
            className="relative my-auto w-full max-w-[940px] outline-none"
            initial={
              reduced
                ? { opacity: 0 }
                : { opacity: 0, scale: 0.96, y: 14, filter: "blur(10px)" }
            }
            animate={
              reduced
                ? { opacity: 1 }
                : { opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }
            }
            exit={
              reduced
                ? { opacity: 0 }
                : { opacity: 0, scale: 0.96, y: 10, filter: "blur(10px)" }
            }
            transition={{ duration: reduced ? 0.15 : 0.44, ease: EASE_OUT_EXPO }}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute -inset-6 -z-10 rounded-[44px] bg-violet-600/20 blur-3xl"
            />

            <div className="relative overflow-hidden rounded-[26px] border border-white/[0.10] bg-[linear-gradient(180deg,rgba(23,17,40,.92)_0%,rgba(11,7,19,.96)_100%)] shadow-[0_40px_120px_rgba(4,2,12,.7)] sm:rounded-[30px]">
              <span
                aria-hidden
                className="pointer-events-none absolute left-12 right-12 top-0 z-10 h-px bg-gradient-to-r from-transparent via-violet-300/45 to-transparent"
              />

              {/* ── Header ─────────────────────────────────── */}
              <div className="relative flex items-start gap-5 border-b border-white/[0.07] px-6 py-6 sm:px-9 sm:py-7">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                    <span className="rounded-full border border-violet-500/25 bg-violet-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-violet-300">
                      {project.category}
                    </span>
                    <span
                      aria-hidden
                      className="text-[11px] font-semibold tracking-[0.22em] text-white/20"
                    >
                      {project.index}
                    </span>
                  </div>

                  <h3
                    id="project-modal-title"
                    className="mt-3 font-['Space_Grotesk'] text-[21px] font-bold tracking-[-0.02em] text-white sm:text-[26px]"
                  >
                    {project.title}
                  </h3>

                  <div className="mt-3 flex items-center gap-2">
                    <img
                      src={logo}
                      alt=""
                      aria-hidden
                      className="h-[16px] w-auto select-none opacity-70"
                    />
                    <span className="text-[10px] font-medium uppercase tracking-[0.26em] text-white/35">
                      Afaq<span className="ml-1.5 text-violet-400/70">AI</span>
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close"
                  className="-mr-1 -mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/[0.09] bg-white/[0.03] text-white/55 transition-all duration-300 hover:border-violet-400/35 hover:bg-white/[0.07] hover:text-white"
                >
                  <X size={16} strokeWidth={2.2} />
                </button>
              </div>

              {/* ── Body ───────────────────────────────────── */}
              <div className="relative max-h-[min(62vh,640px)] overflow-y-auto overscroll-contain px-6 py-8 sm:px-9">
                <div className="flex flex-col gap-10">
                  <ProjectCover
                    project={project}
                    emphasis="modal"
                    className="aspect-[16/9] w-full sm:aspect-[2.2/1]"
                  />

                  <Block label="Overview">
                    <p className="text-[15px] leading-[1.85] text-white/70 lg:text-[16px]">
                      {project.description}
                    </p>
                  </Block>

                  <div className="grid gap-10 md:grid-cols-2">
                    <Block label="The Challenge">
                      <p className="text-[14px] leading-[1.8] text-white/60">
                        {project.challenge}
                      </p>
                    </Block>

                    <Block label="The Solution">
                      <p className="text-[14px] leading-[1.8] text-white/60">
                        {project.solution}
                      </p>
                    </Block>
                  </div>

                  <Block label="Key Features">
                    <ul className="grid gap-3.5 sm:grid-cols-2">
                      {project.features.map((f) => (
                        <li key={f} className="flex gap-3.5">
                          <span
                            aria-hidden
                            className="mt-[3px] flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border border-violet-400/25 bg-violet-500/10"
                          >
                            <Check
                              size={11}
                              strokeWidth={3}
                              className="text-violet-300"
                            />
                          </span>
                          <span className="text-[14px] leading-[1.7] text-white/65">
                            {f}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </Block>

                  <Block label="Technology Stack">
                    <ul className="flex flex-wrap gap-2.5">
                      {project.tech.map((t) => (
                        <li
                          key={t}
                          className="rounded-full border border-violet-500/20 bg-violet-500/[0.07] px-4 py-2 text-[12.5px] font-medium text-violet-200/85 transition-colors duration-300 hover:border-violet-400/35 hover:text-white"
                        >
                          {t}
                        </li>
                      ))}
                    </ul>
                  </Block>

                  <Block label="Project Impact">
                    <p className="text-[14px] leading-[1.8] text-white/60">
                      {project.impact}
                    </p>
                  </Block>
                </div>
              </div>

              {/* ── Footer ─────────────────────────────────── */}
              <div className="relative flex flex-col gap-3 border-t border-white/[0.07] px-6 py-6 sm:flex-row sm:items-center sm:gap-4 sm:px-9">
                <PrimaryButton onClick={goToContact}>
                  Start a Project
                </PrimaryButton>
                <p className="text-[12.5px] leading-[1.6] text-white/35">
                  Tell us what you are trying to automate — we will map it with
                  you.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default ProjectModal;
