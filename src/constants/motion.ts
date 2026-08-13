/**
 * Motion tokens.
 *
 * Timings below are transcribed from the reference video (10.01s @ 24fps).
 * Frame timestamps that anchor each value are noted inline so the sequence
 * can be re-verified against the source.
 */

type Bezier = [number, number, number, number];

/* ==========================================================
   EASING
========================================================== */

/** Decelerating, long tail. Entrances that should feel "placed", not thrown. */
export const EASE_OUT_EXPO: Bezier = [0.16, 1, 0.3, 1];

/** Slightly tighter than expo. Text reveals. */
export const EASE_OUT_QUINT: Bezier = [0.22, 1, 0.36, 1];

/** Symmetric. Idle loops that must not read as having a start or end. */
export const EASE_IN_OUT_SINE: Bezier = [0.37, 0, 0.63, 1];

/** Gentle overshoot-free settle for scale-ups. */
export const EASE_OUT_BACK_SOFT: Bezier = [0.34, 1.24, 0.64, 1];

/* ==========================================================
   ENTRANCE TIMELINE  (seconds from mount)

   0.00  navbar pill begins sliding down          [f_002 @ 0.25s]
   0.45  nav links fade in, left to right         [f_003 @ 0.50s]
   0.72  heading line 1 "BUILD"                   [f_004 @ 0.75s]
   0.80  badge                                    [f_005 @ 1.00s]
   0.97  heading line 2 "INTELLIGENT AI"          [f_005 @ 1.00s]
   1.22  heading line 3 "FOR MODERN"              [f_006 @ 1.25s]
   1.47  heading line 4 "BUSINESSES."             [f_007 @ 1.50s]
   1.55  paragraph                                [f_007 @ 1.50s]
   1.78  CTA buttons                              [f_008 @ 1.75s]
   2.00  hero logo enters small, inside portal    [f_009 @ 2.00s]
   2.30  orbit rings draw in as light trails      [f_010 @ 2.25s]
   2.55  orbit icons fade in                      [f_011 @ 2.50s]
   3.00  fully settled into idle loop             [f_012 @ 2.75s]
========================================================== */

export const T = {
  navShell: 0.0,
  navItems: 0.45,
  navItemStagger: 0.08,

  badge: 0.8,

  titleStart: 0.72,
  titleStagger: 0.25,

  paragraph: 1.55,
  paragraphStagger: 0.12,

  buttons: 1.78,
  buttonStagger: 0.14,

  heroLogo: 2.0,
  orbitDraw: 2.3,
  orbitStagger: 0.13,
  orbitIcons: 2.55,
  orbitIconStagger: 0.09,
} as const;

export const D = {
  navShell: 0.9,
  navItem: 0.55,
  titleLine: 0.62,
  paragraph: 0.7,
  button: 0.6,
  heroLogo: 1.1,
  orbitDraw: 1.4,
  orbitIcon: 0.7,
} as const;

/* ==========================================================
   IDLE LOOP DURATIONS

   Ring periods are intentionally coprime-ish so the composite
   pattern does not visibly repeat.
========================================================== */

export const IDLE = {
  logoFloat: 6,
  logoTilt: 9,
  lightSweep: 7,
  corePulse: 4.5,
  navLogoFloat: 5,
  navLogoSweep: 6.5,
  /** Navbar mark's idle "breathing" scale. Long and coprime with the float
   *  period so the two never visibly sync up. */
  navLogoBreathe: 5.5,
} as const;

/* ==========================================================
   SHARED VARIANTS
========================================================== */

/** Blur-to-sharp rise. Matches the heading reveal in the reference. */
export const riseBlur = {
  hidden: { opacity: 0, y: 26, filter: "blur(12px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)" },
};

/** Same motion without the filter, for reduced-motion and for cheap elements. */
export const rise = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0 },
};

export const fade = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
};
