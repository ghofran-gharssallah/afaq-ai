import logo from "../../../assets/logo/logo.png";
import type { Project } from "./projects.data";

/**
 * The visual anchor for a case study, shared by the card and the modal.
 *
 * When a project has a real screenshot it is shown edge to edge, framed and
 * tinted so it sits inside the site's glass language rather than looking like
 * a pasted image. When it does not, a designed cover takes its place — an
 * abstract panel carrying the mark and category, which reads as an
 * intentional editorial treatment rather than a missing asset. It never
 * pretends to depict the product.
 */
interface ProjectCoverProps {
  project: Project;
  /** Cards use a softer treatment; the modal shows the image at full strength. */
  emphasis?: "card" | "modal";
  className?: string;
}

const ProjectCover = ({
  project,
  emphasis = "card",
  className = "",
}: ProjectCoverProps) => {
  const { image, imageAlt, category } = project;

  return (
    <div
      className={`relative overflow-hidden rounded-[18px] border border-white/[0.08] bg-[#060612] ${className}`}
    >
      {image ? (
        <>
          <img
            src={image}
            alt={imageAlt ?? ""}
            loading="lazy"
            decoding="async"
            className={`
              h-full w-full object-cover object-center
              transition-transform duration-[900ms] ease-out
              ${emphasis === "card" ? "group-hover:scale-[1.035]" : ""}
            `}
          />
          {/* Tint + vignette so the screenshot reads as part of the surface */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(11,7,19,.12) 0%, rgba(11,7,19,.10) 55%, rgba(11,7,19,.55) 100%), radial-gradient(120% 90% at 50% 0%, rgba(117,73,216,.14), transparent 62%)",
            }}
          />
        </>
      ) : (
        /* Designed cover — deliberately abstract, never a mock screenshot. */
        <div className="relative flex h-full w-full items-center justify-center">
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(90% 70% at 50% 18%, rgba(117,73,216,.30), transparent 66%), radial-gradient(70% 60% at 82% 96%, rgba(79,40,183,.20), transparent 68%)",
            }}
          />
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.05]
              [background-image:linear-gradient(rgba(255,255,255,.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.5)_1px,transparent_1px)]
              [background-size:44px_44px]
              [mask-image:radial-gradient(ellipse_78%_70%_at_50%_45%,black,transparent_82%)]"
          />

          <div className="relative flex flex-col items-center gap-4 px-6 text-center">
            <img
              src={logo}
              alt=""
              aria-hidden
              className="w-[62px] select-none opacity-80 sm:w-[76px]"
              style={{ filter: "drop-shadow(0 0 28px rgba(79,40,183,.55))" }}
            />
            <span className="text-[10.5px] font-semibold uppercase tracking-[0.26em] text-violet-300/60">
              {category}
            </span>
          </div>
        </div>
      )}

      {/* Inner hairline, so the frame reads as glass rather than a plain box */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[18px] ring-1 ring-inset ring-white/[0.06]"
      />
    </div>
  );
};

export default ProjectCover;
