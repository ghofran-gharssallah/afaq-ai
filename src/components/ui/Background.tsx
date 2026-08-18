import { useEffect, useRef } from "react";

import { useIsMobile } from "../../hooks/useIsMobile";

/**
 * Global background environment.
 *
 * Built as a depth stack rather than a flat wash. Read back to front, each
 * layer has one job and one parallax rate — nearer layers travel further, so
 * pointer movement resolves the stack into a space rather than a picture:
 *
 *   0  base          flat brand black, the void
 *   1  depth planes  two vast gradients that give the void a far wall
 *   2  horizon       floor bounce light, establishes a ground plane
 *   3  floor grid    true CSS perspective — the main 3D cue
 *   4  key light     the bright core behind the hero mark
 *   5  orb cluster   mid-depth ambient pools
 *   6  rays          volumetric shafts from the upper left
 *   7  fog           slow atmospheric drift along the floor
 *   8  dust          far, tiny, slow motes
 *   9  stars         mid-field sparkle
 *  10  motes         near-field soft orbs, largest parallax
 *  11  sheen         a slow specular sweep across the whole frame
 *  12  vignette      closes the edges so the centre reads as lit
 *
 * PERFORMANCE
 * Deliberately zero `filter: blur()`. The previous build used ten blurred
 * layers (up to 200px radius); a wide blur is a costly convolution that is
 * re-run whenever the layer is invalidated, whereas a radial-gradient with a
 * soft falloff is visually equivalent and rasterises once. Everything that
 * moves animates only transform/opacity, so the whole stack lives on the
 * compositor.
 */

/* ==========================================================
   PARTICLE FIELDS

   Three tiers at different depths. All coordinates are fixed so the field
   never reshuffles between renders. Nothing sits above y=16%: the navbar is a
   backdrop-filter surface, and anything animating beneath it forces that blur
   to be recomputed every frame.
========================================================== */

/** Tier 3 — far dust. Tiny, dim, slowest. */
const DUST = [
  { x: 20, y: 30, s: 0.8, d: 8.5, delay: 0.5 },
  { x: 33, y: 66, s: 0.7, d: 9.2, delay: 2.8 },
  { x: 41, y: 20, s: 0.9, d: 7.8, delay: 5.1 },
  { x: 49, y: 77, s: 0.7, d: 10.1, delay: 1.2 },
  { x: 58, y: 52, s: 0.8, d: 8.9, delay: 3.7 },
  { x: 69, y: 25, s: 0.7, d: 9.6, delay: 6.2 },
  { x: 74, y: 61, s: 0.9, d: 7.4, delay: 0.9 },
  { x: 82, y: 41, s: 0.7, d: 10.5, delay: 4.4 },
  { x: 14, y: 49, s: 0.7, d: 9.9, delay: 5.6 },
  { x: 64, y: 86, s: 0.7, d: 10.3, delay: 1.7 },
];

/** Tier 2 — mid-field stars. */
const STARS = [
  { x: 12, y: 18, s: 1.6, d: 4.2, delay: 0 },
  { x: 23, y: 42, s: 1.1, d: 5.6, delay: 1.4 },
  { x: 44, y: 27, s: 1.0, d: 4.8, delay: 0.7 },
  { x: 52, y: 63, s: 1.5, d: 5.2, delay: 3.6 },
  { x: 66, y: 38, s: 1.7, d: 4.5, delay: 1.1 },
  { x: 71, y: 72, s: 1.1, d: 5.9, delay: 4.3 },
  { x: 78, y: 22, s: 1.4, d: 6.3, delay: 0.4 },
  { x: 84, y: 55, s: 1.2, d: 4.9, delay: 2.6 },
  { x: 89, y: 33, s: 1.6, d: 5.4, delay: 3.1 },
  { x: 94, y: 68, s: 1.0, d: 6.6, delay: 1.8 },
  { x: 8, y: 61, s: 1.3, d: 5.1, delay: 3.9 },
  { x: 17, y: 79, s: 1.1, d: 4.4, delay: 0.9 },
  { x: 37, y: 84, s: 1.4, d: 6.0, delay: 2.4 },
  { x: 62, y: 88, s: 1.5, d: 4.6, delay: 1.6 },
  { x: 27, y: 57, s: 1.3, d: 5.3, delay: 2.2 },
  { x: 55, y: 45, s: 0.9, d: 6.9, delay: 4.1 },
];

/**
 * Tier 1 — near motes. Few, large and very soft, kept to the outer thirds so
 * they frame the hero rather than crossing it. Rendered as gradients, not
 * blurred dots.
 */
const MOTES = [
  { x: 9, y: 34, s: 46, d: 15, delay: 0 },
  { x: 18, y: 72, s: 34, d: 18, delay: 4.5 },
  { x: 86, y: 28, s: 40, d: 16.5, delay: 2.2 },
  { x: 92, y: 63, s: 30, d: 19.5, delay: 7 },
  { x: 31, y: 90, s: 36, d: 17, delay: 9.5 },
  { x: 73, y: 86, s: 28, d: 20, delay: 5.8 },
];

/**
 * Volumetric shafts from the upper left. Softness comes from the gradient's
 * own falloff on both axes, so no blur filter is needed.
 */
const RAYS = [
  { left: "-8%", w: 300, rot: 17, dur: 13, op: 0.13 },
  { left: "7%", w: 190, rot: 19, dur: 17, op: 0.1 },
  { left: "19%", w: 380, rot: 16, dur: 21, op: 0.075 },
  { left: "34%", w: 150, rot: 20, dur: 15, op: 0.055 },
];

/** A beam: bright core fading out sideways, and fading out down its length. */
const beam =
  "linear-gradient(90deg, transparent 0%, rgba(208,194,227,.30) 42%, rgba(245,242,249,.42) 50%, rgba(208,194,227,.30) 58%, transparent 100%)";
const beamMask =
  "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,.65) 34%, rgba(0,0,0,0) 82%)";

/**
 * Parallax offset for a layer at a given depth, in px of travel at the
 * viewport edge. Vertical travel is damped to 55% so the effect reads as
 * depth rather than the page sliding around.
 */
const par = (px: number): React.CSSProperties => ({
  transform: `translate3d(calc(var(--par-x, 0) * ${px}px), calc(var(--par-y, 0) * ${(
    px * 0.55
  ).toFixed(1)}px), 0)`,
});

const Background = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  /**
   * Every particle below carries `will-change`, which promotes it to its own
   * compositor layer for the page's entire lifetime — not just while
   * animating. This component is mounted once and stays on screen behind
   * every route, so ~36 permanently-promoted layers is a real, constant GPU
   * memory/compositing cost on mobile. Halving the counts keeps the same
   * field density and randomness (same fixed coordinates, just fewer of
   * them), not a different effect. Desktop keeps every particle.
   */
  /**
   * Measured with Chrome DevTools' CPU throttling (4x — Lighthouse's own
   * mobile-equivalent multiplier) plus a `longtask` PerformanceObserver:
   * on a mid-range-mobile-equivalent CPU, this particle field was the single
   * largest contributor to main-thread blocking at idle — more than double
   * any other individual atmosphere layer (floor grid, fog, sheen, key
   * light), because each particle is `will-change`-promoted to its own
   * compositor layer for the page's entire lifetime. Cut further than the
   * first pass to bring idle blocking down substantially; same field, same
   * randomness, just fewer instances of it.
   */
  const dust = isMobile ? DUST.slice(0, 3) : DUST;
  const stars = isMobile ? STARS.slice(0, 4) : STARS;
  const motes = isMobile ? MOTES.slice(0, 2) : MOTES;
  const rays = isMobile ? RAYS.slice(0, 2) : RAYS;

  /**
   * Pointer parallax writes two CSS variables once per frame; every layer
   * multiplies them by its own depth factor in CSS. No React state, so moving
   * the pointer never triggers a render, and the cost is zero while the
   * pointer is still. Skipped for coarse pointers and reduced motion.
   */
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !window.matchMedia("(pointer: fine)").matches
    ) {
      return;
    }

    let raf = 0;
    let x = 0;
    let y = 0;

    const commit = () => {
      raf = 0;
      el.style.setProperty("--par-x", x.toFixed(4));
      el.style.setProperty("--par-y", y.toFixed(4));
    };

    const onMove = (e: PointerEvent) => {
      x = (e.clientX / window.innerWidth) * 2 - 1;
      y = (e.clientY / window.innerHeight) * 2 - 1;
      if (!raf) raf = requestAnimationFrame(commit);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={rootRef} className="fixed inset-0 -z-50 overflow-hidden">
      {/* 0 ─ Base ------------------------------------------------------ */}
      <div className="absolute inset-0 bg-[#01010A]" />

      {/* 1 ─ Depth planes. Two vast, very soft washes that give the void a far
             wall. Deliberately STATIC and merged onto one element: these are
             the largest layers in the stack, and a 1.2% drift over 72s is
             imperceptible — it animated two full-viewport layers for no visible
             gain. Parallax still moves them, so they are not inert; the sense
             of life comes from the fog, floor, rays and sheen instead. ---- */}
      <div
        className="absolute -inset-[10%]"
        style={{
          ...par(3),
          background: [
            "radial-gradient(58% 46% at 20% 8%, rgba(58,28,145,.34), transparent 72%)",
            "radial-gradient(56% 44% at 84% 88%, rgba(41,18,110,.40), transparent 74%)",
          ].join(","),
        }}
      />

      {/* 2 ─ Horizon. Light pooling on an implied ground plane — the cue that
             sells "room" rather than "gradient". ------------------------- */}
      <div
        className="absolute inset-x-0 bottom-0 h-[62%]"
        style={{
          ...par(6),
          background:
            "radial-gradient(72% 100% at 50% 108%, rgba(79,40,183,.26), rgba(58,28,145,.10) 46%, transparent 76%)",
        }}
      />

      {/* 3 ─ Perspective floor grid. A real rotateX projection with its own
             vanishing point: the strongest depth cue in the stack, held at
             very low opacity so it reads as structure, not decoration. --- */}
      <div
        className="absolute inset-x-0 bottom-0 h-[58%] [perspective:520px] [perspective-origin:50%_0%]"
        style={par(8)}
      >
        <div
          className="atmos-floor absolute inset-0 origin-top opacity-[0.16]"
          style={
            {
              "--floor-dur": "30s",
              backgroundImage:
                "linear-gradient(rgba(164,124,237,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(164,124,237,.5) 1px, transparent 1px)",
              backgroundSize: "92px 92px",
              maskImage:
                "radial-gradient(70% 82% at 50% 100%, rgba(0,0,0,.95), transparent 72%)",
              WebkitMaskImage:
                "radial-gradient(70% 82% at 50% 100%, rgba(0,0,0,.95), transparent 72%)",
            } as React.CSSProperties
          }
        />
      </div>

      {/* 4 ─ Volumetric key light. Sits behind the hero mark; centred on
             mobile, shifted into the second grid column from lg up. This is
             what makes the centre brighter than the edges. --------------- */}
      <div
        className="
          atmos-keylight absolute
          left-1/2 top-[26%] h-[620px] w-[620px]
          -translate-x-1/2 -translate-y-1/2
          lg:left-[68%] lg:top-[46%] lg:h-[1080px] lg:w-[1080px]
        "
        style={{
          background:
            "radial-gradient(circle, rgba(164,124,237,.20) 0%, rgba(117,73,216,.13) 26%, rgba(79,40,183,.06) 48%, transparent 70%)",
        }}
      />

      {/* 5 ─ Ambient orb cluster. Mid-depth pools that were blurred circles
             before; identical read, no filter. --------------------------- */}
      <div className="absolute inset-0" style={par(11)}>
        <div
          className="absolute left-1/2 top-[-30%] h-[900px] w-[900px] -translate-x-1/2"
          style={{
            background:
              "radial-gradient(circle, rgba(79,40,183,.20) 0%, rgba(79,40,183,.07) 40%, transparent 68%)",
          }}
        />
        <div
          className="absolute bottom-[-24%] right-[-16%] h-[820px] w-[820px]"
          style={{
            background:
              "radial-gradient(circle, rgba(117,73,216,.16) 0%, rgba(117,73,216,.05) 42%, transparent 70%)",
          }}
        />
        <div
          className="absolute left-[-18%] top-1/4 h-[680px] w-[680px]"
          style={{
            background:
              "radial-gradient(circle, rgba(41,18,110,.11) 0%, rgba(41,18,110,.04) 44%, transparent 72%)",
          }}
        />
      </div>

      {/* 6 ─ Volumetric rays. Static rotation on the wrapper, animation on the
             inner layer, so the beam texture is rasterised once. --------- */}
      <div className="absolute inset-0 overflow-hidden" style={par(19)}>
        {rays.map((ray, i) => (
          <div
            key={i}
            className="absolute top-[-45%] h-[195%] origin-top"
            style={{
              left: ray.left,
              width: ray.w,
              opacity: ray.op,
              transform: `rotate(${ray.rot}deg)`,
            }}
          >
            <div
              className="atmos-ray absolute inset-0"
              style={
                {
                  "--ray-dur": `${ray.dur}s`,
                  background: beam,
                  maskImage: beamMask,
                  WebkitMaskImage: beamMask,
                } as React.CSSProperties
              }
            />
          </div>
        ))}
      </div>

      {/* 7 ─ Fog. Oversized so the drift is a pure translate of an already
             rasterised layer. ------------------------------------------- */}
      <div
        className="absolute inset-x-0 bottom-0 h-[58vh] overflow-hidden"
        style={par(30)}
      >
        <div
          className="atmos-fog absolute -inset-x-[22%] -inset-y-[18%]"
          style={
            {
              "--fog-dur": "38s",
              background:
                "radial-gradient(46% 62% at 28% 100%, rgba(164,124,237,.17), transparent 72%), radial-gradient(38% 54% at 70% 100%, rgba(208,194,227,.13), transparent 74%)",
            } as React.CSSProperties
          }
        />
        <div
          className="atmos-fog-alt absolute -inset-x-[22%] -inset-y-[18%]"
          style={
            {
              "--fog-dur": "52s",
              background:
                "radial-gradient(54% 46% at 52% 100%, rgba(117,73,216,.14), transparent 70%)",
            } as React.CSSProperties
          }
        />
      </div>

      {/* 8 ─ Far dust ------------------------------------------------------ */}
      <div className="absolute inset-0" style={par(7)}>
        {dust.map((p, i) => (
          <span
            key={i}
            className="atmos-star absolute rounded-full bg-violet-200"
            style={
              {
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: p.s,
                height: p.s,
                opacity: 0.5,
                "--star-dur": `${p.d}s`,
                "--star-delay": `${p.delay}s`,
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      {/* 9 ─ Mid-field stars ---------------------------------------------- */}
      <div className="absolute inset-0" style={par(15)}>
        {stars.map((star, i) => (
          <span
            key={i}
            className="atmos-star absolute rounded-full bg-white"
            style={
              {
                left: `${star.x}%`,
                top: `${star.y}%`,
                width: star.s,
                height: star.s,
                "--star-dur": `${star.d}s`,
                "--star-delay": `${star.delay}s`,
                boxShadow: "0 0 6px rgba(245,242,249,.9)",
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      {/* 10 ─ Near motes. Largest parallax, so they separate hardest from the
              far field. Gradient discs rather than blurred dots. --------- */}
      <div className="absolute inset-0" style={par(38)}>
        {motes.map((m, i) => (
          <span
            key={i}
            className="atmos-orb absolute rounded-full"
            style={
              {
                left: `${m.x}%`,
                top: `${m.y}%`,
                width: m.s,
                height: m.s,
                marginLeft: -m.s / 2,
                marginTop: -m.s / 2,
                "--orb-dur": `${m.d}s`,
                "--orb-delay": `${m.delay}s`,
                background:
                  "radial-gradient(circle, rgba(245,242,249,.45) 0%, rgba(164,124,237,.16) 38%, transparent 70%)",
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      {/* 11 ─ Specular sweep. One very slow, very low-contrast band of light
              travelling across the frame — the "screen reflection" pass that
              keeps the composition from ever looking frozen. ------------- */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="atmos-sheen absolute -inset-y-[30%] left-[-25%] w-[150%] origin-center"
          style={
            {
              "--sheen-dur": "48s",
              transform: "rotate(-14deg)",
              background:
                "linear-gradient(100deg, transparent 34%, rgba(208,194,227,.055) 47%, rgba(245,242,249,.085) 50%, rgba(208,194,227,.055) 53%, transparent 66%)",
            } as React.CSSProperties
          }
        />
      </div>

      {/* 12 ─ Vignette. Static, unblurred; darkens the far edges so the centre
              reads as the lit part of the room. -------------------------- */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(128% 108% at 50% 44%, transparent 48%, rgba(6,6,18,.40) 80%, rgba(1,1,10,.78) 100%)",
        }}
      />
    </div>
  );
};

export default Background;
