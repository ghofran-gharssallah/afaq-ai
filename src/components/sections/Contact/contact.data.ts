/**
 * Project-type options for the subject field.
 *
 * Mirrors the six offerings in the Services section so an enquiry arrives
 * already routed, plus an escape hatch. Kept here rather than imported from
 * Services so the two can diverge without coupling the sections.
 */
export const PROJECT_TYPES = [
  "AI Automation",
  "AI Agents",
  "Custom Chatbots",
  "Web Development",
  "AI Integrations",
  "AI Consulting",
  "Something else",
] as const;

/**
 * Short reassurances shown beside the form.
 *
 * Every line restates something already claimed elsewhere on the site
 * (Process, About, Services) — no new promises about response times,
 * availability or outcomes are made here.
 */
export const ASSURANCES: { title: string; body: string }[] = [
  {
    title: "Discovery first",
    body: "We start by understanding the business and the goal — not by pitching a stack.",
  },
  {
    title: "A small senior team",
    body: "You work directly with the people who design and build the system.",
  },
  {
    title: "Built to scale",
    body: "Architecture that holds up under real operational load, not just a demo.",
  },
];
