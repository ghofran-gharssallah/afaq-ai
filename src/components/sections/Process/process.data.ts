import {
  Activity,
  Braces,
  PenTool,
  Rocket,
  Route,
  Search,
  type LucideIcon,
} from "lucide-react";

/**
 * The six milestones of an engagement, in order.
 *
 * `note` is the small qualifier printed under the divider on each card — it is
 * what stops the section reading as six restatements of the title, and gives
 * each step a concrete deliverable the reader can hold on to.
 *
 * Named process.data.ts to match the other sections, and because a bare
 * process.ts would shadow Process.tsx on a case-insensitive filesystem
 * (TypeScript resolves .ts before .tsx).
 */
export interface ProcessStep {
  id: string;
  title: string;
  description: string;
  /** Concrete output of the step. */
  note: string;
  Icon: LucideIcon;
}

export const PROCESS: ProcessStep[] = [
  {
    id: "01",
    title: "Discovery",
    description: "Understanding the business, goals and challenges.",
    note: "Stakeholder interviews and a map of where the hours actually go.",
    Icon: Search,
  },
  {
    id: "02",
    title: "Strategy",
    description: "Planning the AI solution, architecture and roadmap.",
    note: "Data flows, model choices and success metrics agreed up front.",
    Icon: Route,
  },
  {
    id: "03",
    title: "Design",
    description:
      "Designing premium user experiences and intelligent workflows.",
    note: "Interface and workflow design reviewed in the browser, not in slides.",
    Icon: PenTool,
  },
  {
    id: "04",
    title: "Development",
    description:
      "Building scalable applications, automations and AI systems.",
    note: "Shipped incrementally, so value lands in weeks rather than quarters.",
    Icon: Braces,
  },
  {
    id: "05",
    title: "Testing & Optimization",
    description: "Refining performance, security and user experience.",
    note: "Evaluation harnesses, load testing and a measured performance budget.",
    Icon: Activity,
  },
  {
    id: "06",
    title: "Launch & Continuous Support",
    description: "Deployment, monitoring and long-term improvements.",
    note: "Production rollout with monitoring and a handover your team can own.",
    Icon: Rocket,
  },
];
