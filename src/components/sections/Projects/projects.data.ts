import youtubeWorkflow from "../../../assets/projects/YouTube-AI-Comment-Assistant.jpeg";
import dentalClinicWorkflow from "../../../assets/projects/dental-clinic-ai.jpeg";

/**
 * The two featured case studies.
 *
 * ─────────────────────────────────────────────────────────────
 * IMAGES
 *
 * Both files in `src/assets/projects/` are n8n workflow canvases of the
 * YouTube automation — `dental-clinic-ai.jpeg` shows the same Check Every 5
 * Minutes → HTTP Request → Split Out → If → Get Video Info → AI Agent chain
 * as Project 01, not the dental clinic system itself. Wired in at explicit
 * request despite that mismatch; swap the import if a real screenshot of the
 * dental platform becomes available later.
 *
 * ─────────────────────────────────────────────────────────────
 * COPY
 *
 * Titles, categories, descriptions, features and stacks are exactly as
 * supplied. `challenge`, `solution` and `impact` were drafted from those
 * descriptions for the case-study modal — they contain no metrics, client
 * names or outcomes that were not given. Please review before shipping.
 * ─────────────────────────────────────────────────────────────
 */
export interface Project {
  id: string;
  /** Two-digit marker used as an editorial numeral. */
  index: string;
  category: string;
  title: string;
  description: string;
  /** Absent when no truthful image exists — a designed cover is used. */
  image?: string;
  /** Alt text, only meaningful when `image` is set. */
  imageAlt?: string;
  features: string[];
  tech: string[];
  challenge: string;
  solution: string;
  impact: string;
  /** Drives the composition: stacked = image above, split = image beside. */
  variant: "stacked" | "split";
}

export const PROJECTS: Project[] = [
  {
    id: "youtube-ai-comment-assistant",
    index: "01",
    category: "AI Automation",
    title: "YouTube AI Comment Assistant",
    description:
      "An intelligent AI workflow that continuously monitors YouTube channels, understands newly published content and delivers smart, structured notifications directly to Telegram.",
    image: youtubeWorkflow,
    imageAlt:
      "The n8n workflow canvas: a five-minute schedule trigger feeding HTTP requests to the YouTube Data API, a split and conditional branch, video lookup, an AI agent backed by an OpenRouter chat model, and two Telegram message nodes.",
    features: [
      "Automated YouTube channel monitoring",
      "Newly published video detection",
      "AI-powered content understanding",
      "LLM-powered response generation",
      "Instant Telegram notifications",
      "Fully automated n8n workflow",
    ],
    tech: [
      "n8n",
      "YouTube Data API",
      "OpenRouter",
      "LLM Agent",
      "Telegram Bot API",
      "HTTP Requests",
    ],
    challenge:
      "Keeping up with a channel's activity means checking constantly, reading each new upload and deciding whether it warrants a response — work that is repetitive, easy to fall behind on, and impossible to do consistently by hand.",
    solution:
      "A scheduled n8n workflow polls the YouTube Data API every five minutes, splits and filters the results so only genuinely new uploads continue, then enriches each one with full video details. An LLM agent running through OpenRouter interprets the content and drafts a structured response, which is pushed straight to Telegram.",
    impact:
      "Channel monitoring runs unattended and around the clock, with new uploads surfacing as structured, already-interpreted messages rather than raw alerts — so the decision is what to do next, not what happened.",
    variant: "stacked",
  },
  {
    id: "dental-clinic-ai",
    index: "02",
    category: "AI Healthcare",
    title: "AI-Powered Dental Clinic Management System",
    description:
      "A complete AI-powered management platform designed to streamline patient communication, appointments, follow-ups and daily clinic operations through intelligent automation.",
    image: dentalClinicWorkflow,
    imageAlt:
      "The n8n workflow canvas: a five-minute schedule trigger feeding HTTP requests, a split and conditional branch, video lookup, an AI agent backed by an OpenRouter chat model, and two Telegram message nodes.",
    features: [
      "AI-assisted patient communication",
      "Appointment booking and management",
      "Patient records management",
      "Automated reminders and follow-ups",
      "Administrative dashboard",
      "Workflow automation",
      "Scalable architecture for future AI integrations",
    ],
    tech: [
      "React",
      "Next.js",
      "Node.js",
      "Database",
      "REST APIs",
      "AI Integration",
      "Workflow Automation",
    ],
    challenge:
      "Clinic operations fragment across phone calls, paper records and memory. Reminders get missed, follow-ups depend on whoever remembers, and administrative work competes directly with patient time.",
    solution:
      "A single platform covering booking, patient records and daily operations, with AI assisting the communication layer and workflow automation handling reminders and follow-ups. The architecture is deliberately open so further AI capabilities can be added without a rebuild.",
    impact:
      "Routine coordination moves off the front desk and into the system, giving staff one place to run the day and a foundation that can absorb new automation as the clinic grows.",
    variant: "split",
  },
];
