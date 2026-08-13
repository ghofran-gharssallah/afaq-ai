/**
 * Footer navigation and contact configuration.
 *
 * ─────────────────────────────────────────────────────────────
 * FILL THESE IN — email and social links are intentionally empty.
 *
 * Nothing here was invented. The codebase contains no contact address and no
 * social profiles, so rather than shipping a plausible-looking placeholder
 * that could end up live, each entry renders only once it has a real value:
 *
 *   • `EMAIL` empty  → the email line is not rendered
 *   • a social `href` empty → that icon is not rendered
 *
 * This mirrors how the About section handles its empty LinkedIn fields.
 * If you later want these shared beyond the footer, lift this to
 * `src/config/site.ts` alongside the EmailJS config.
 * ─────────────────────────────────────────────────────────────
 */

/** Public contact address, e.g. "hello@afaq.ai". Leave empty to hide. */
export const EMAIL = "";

export interface FooterLink {
  label: string;
  /** In-page anchor — every one of these section ids exists in App.tsx. */
  href: string;
}

export interface FooterGroup {
  heading: string;
  links: FooterLink[];
}

/**
 * Only real, in-page destinations. There is no router mounted and
 * `src/pages` / `src/routes` are empty, so no Privacy or Terms links are
 * included — they would 404.
 */
export const FOOTER_NAV: FooterGroup[] = [
  {
    heading: "Company",
    links: [
      { label: "About", href: "#about" },
      { label: "Why Choose AFAQ", href: "#why-choose" },
      { label: "Our Process", href: "#process" },
    ],
  },
  {
    heading: "Explore",
    links: [
      { label: "Services", href: "#services" },
      { label: "Technologies", href: "#technologies" },
      { label: "Featured Projects", href: "#projects" },
    ],
  },
];

export type SocialId = "facebook" | "linkedin";

export interface SocialLink {
  id: SocialId;
  label: string;
  /** Full profile URL. Empty hides the link entirely. */
  href: string;
}

export const SOCIALS: SocialLink[] = [
  {
    id: "facebook",
    label: "Facebook",
    href: "https://www.facebook.com/share/1bBoJGiTi7/?mibextid=wwXIfr",
  },
  {
    // Placeholder until the real profile URL is available — swap the "#" for
    // the URL and nothing else needs to change. While it is "#", the link is
    // rendered but goes nowhere.
    id: "linkedin",
    label: "LinkedIn",
    href: "#",
  },
];
