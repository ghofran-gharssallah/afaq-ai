import {
  Boxes,
  Clock,
  Gauge,
  Globe,
  Layers,
  LineChart,
  Lock,
  Plug,
  Repeat,
  Rocket,
  Search,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
  Zap,
  type LucideIcon,
} from "lucide-react";

/**
 * Long-form content for the service modal, keyed by the `id` in
 * services.data.ts. Kept separate from the card data so the Services grid
 * never pays for content it does not render.
 */

export interface Benefit {
  label: string;
  Icon: LucideIcon;
}

export interface ProcessStep {
  step: string;
  title: string;
  description: string;
}

export interface ServiceDetail {
  /** Short badge shown beside the title in the modal header. */
  category: string;
  /** One-paragraph positioning statement. */
  overview: string;
  /** Concrete deliverables — what actually ships. */
  whatWeBuild: string[];
  /** Outcome-led benefits, rendered as a chip grid. */
  benefits: Benefit[];
  /** Only the stack genuinely relevant to this service. */
  tech: string[];
  /** Typical engagement, four steps. */
  process: ProcessStep[];
}

/** Shared by every engagement — the shape of how we work does not change. */
const baseProcess = (discovery: string, build: string): ProcessStep[] => [
  {
    step: "01",
    title: "Discovery",
    description: discovery,
  },
  {
    step: "02",
    title: "Architecture",
    description:
      "We map the data flows, choose the models and agree the success metrics before a line of code is written.",
  },
  {
    step: "03",
    title: "Build & Iterate",
    description: build,
  },
  {
    step: "04",
    title: "Launch & Support",
    description:
      "Production rollout with monitoring, evaluation harnesses and a handover your team can own.",
  },
];

export const SERVICE_DETAILS: Record<string, ServiceDetail> = {
  "01": {
    category: "Automation",
    overview:
      "We find the repetitive, high-volume work inside your business and hand it to systems that never tire. The result is not a script that breaks in a month — it is a resilient, observable pipeline your team can trust with real operational load.",
    whatWeBuild: [
      "Event-driven workflow pipelines with full retry and audit trails",
      "Document intake, extraction and routing without manual review",
      "CRM, billing and support automations that stay in sync",
      "Internal dashboards to monitor every run and failure",
    ],
    benefits: [
      { label: "Intelligent Automation", Icon: Zap },
      { label: "Faster Operations", Icon: Gauge },
      { label: "Fewer Manual Errors", Icon: ShieldCheck },
      { label: "Hours Reclaimed Weekly", Icon: Clock },
    ],
    tech: ["n8n", "Python", "OpenAI", "PostgreSQL", "Docker"],
    process: baseProcess(
      "We shadow the existing process and quantify where the hours actually go.",
      "Automations ship incrementally, so value lands in week two rather than month three."
    ),
  },

  "02": {
    category: "Autonomous AI",
    overview:
      "Agents are only useful when they are bounded, observable and safe to let loose. We build task-specific agents with explicit tool access, evaluation suites and human checkpoints — so autonomy is a feature, not a liability.",
    whatWeBuild: [
      "Goal-driven agents with scoped, permissioned tool access",
      "Multi-step planning and reasoning with full execution traces",
      "Human-in-the-loop approval gates on consequential actions",
      "Evaluation harnesses that catch regressions before users do",
    ],
    benefits: [
      { label: "Autonomous Execution", Icon: Sparkles },
      { label: "Enterprise Ready", Icon: Lock },
      { label: "Scalable Architecture", Icon: Layers },
      { label: "Continuous Improvement", Icon: Repeat },
    ],
    tech: ["OpenAI", "Claude", "LangChain", "Python", "PostgreSQL"],
    process: baseProcess(
      "We define the agent's exact remit and, just as importantly, where it must stop.",
      "Each tool is added behind evaluations, so capability grows without losing predictability."
    ),
  },

  "03": {
    category: "Conversational AI",
    overview:
      "A chatbot is a front door to your business, so it should sound like you and know what you know. We ground every answer in your own content, measure resolution rather than deflection, and design the handoff to a human as carefully as the conversation itself.",
    whatWeBuild: [
      "Retrieval-grounded assistants trained on your documentation",
      "Brand-accurate tone, guardrails and refusal behaviour",
      "Live handoff to human agents with full context carried over",
      "Conversation analytics that show what customers actually ask",
    ],
    benefits: [
      { label: "24/7 Availability", Icon: Clock },
      { label: "Higher Resolution Rate", Icon: TrendingUp },
      { label: "Lower Support Cost", Icon: LineChart },
      { label: "On-Brand Every Time", Icon: Users },
    ],
    tech: ["OpenAI", "Claude", "Gemini", "LangChain", "React", "Supabase"],
    process: baseProcess(
      "We audit real support transcripts to learn the questions that actually matter.",
      "The assistant is tuned against a graded answer set until quality is measurable, not anecdotal."
    ),
  },

  "04": {
    category: "Engineering",
    overview:
      "Fast, accessible, and built to last. We ship modern web products with AI woven into the experience rather than bolted on — with the performance budget, type safety and component discipline that keeps a codebase pleasant a year later.",
    whatWeBuild: [
      "Marketing sites and SaaS products with a shared design system",
      "Type-safe front ends with server rendering and edge delivery",
      "AI-native interfaces: streaming, generative and assistive UI",
      "Analytics, A/B testing and performance budgets from day one",
    ],
    benefits: [
      { label: "Sub-Second Loads", Icon: Rocket },
      { label: "Scalable Architecture", Icon: Layers },
      { label: "Accessible By Default", Icon: Globe },
      { label: "Measurable Growth", Icon: TrendingUp },
    ],
    tech: ["React", "Next.js", "TypeScript", "Node.js", "Supabase", "Docker"],
    process: baseProcess(
      "We start from your funnel and the jobs each page has to do.",
      "Design and engineering run together, reviewed in the browser on real devices every week."
    ),
  },

  "05": {
    category: "Integration",
    overview:
      "Most companies do not need a new platform — they need intelligence inside the systems they already run. We integrate model providers into your existing stack with the routing, caching and fallback logic that keeps cost and latency under control.",
    whatWeBuild: [
      "Provider-agnostic model routing with automatic failover",
      "Retrieval pipelines over your existing databases and files",
      "Prompt caching and token budgeting to control spend",
      "Observability: latency, cost and quality per endpoint",
    ],
    benefits: [
      { label: "AI Integration", Icon: Plug },
      { label: "No Vendor Lock-In", Icon: Boxes },
      { label: "Predictable Cost", Icon: LineChart },
      { label: "Enterprise Ready", Icon: ShieldCheck },
    ],
    tech: ["OpenAI", "Claude", "Gemini", "LangChain", "Node.js", "Python"],
    process: baseProcess(
      "We inventory the systems in play and where intelligence would move a metric.",
      "Integrations land behind feature flags so you can compare providers on live traffic."
    ),
  },

  "06": {
    category: "Advisory",
    overview:
      "Before building anything, it is worth knowing what is worth building. We assess where AI creates real leverage in your business, what it will cost, and what it will not solve — then give you a roadmap your team can execute with or without us.",
    whatWeBuild: [
      "Opportunity assessment scored by impact against effort",
      "Technical feasibility studies and provider comparisons",
      "Data-readiness review and governance recommendations",
      "A phased roadmap with budget and staffing implications",
    ],
    benefits: [
      { label: "Clear Priorities", Icon: Search },
      { label: "De-Risked Investment", Icon: ShieldCheck },
      { label: "Faster Time To Value", Icon: Gauge },
      { label: "Team Enablement", Icon: Users },
    ],
    tech: ["OpenAI", "Claude", "Python", "PostgreSQL"],
    process: baseProcess(
      "We interview stakeholders across operations, engineering and leadership.",
      "Findings are pressure-tested with a working prototype before they reach the roadmap."
    ),
  },
};
