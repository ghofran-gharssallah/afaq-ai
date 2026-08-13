import { Check } from "lucide-react";

import type { ServiceDetail } from "./serviceDetails.data";

/**
 * The modal body. Kept separate from ServiceModal so the shell owns chrome,
 * focus and animation, while this owns nothing but content layout.
 */

/** Section label — one definition, used by every block below. */
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
    <div className="mt-5">{children}</div>
  </section>
);

interface ServiceDetailsProps {
  detail: ServiceDetail;
}

const ServiceDetails = ({ detail }: ServiceDetailsProps) => (
  <div className="flex flex-col gap-11">
    {/* ── Overview ─────────────────────────────────────────── */}
    <p className="text-[15px] leading-[1.85] text-white/70 lg:text-[16px]">
      {detail.overview}
    </p>

    {/* ── What we build │ Key benefits ──────────────────────── */}
    <div className="grid gap-11 md:grid-cols-2 md:gap-10">
      <Block label="What We Build">
        <ul className="flex flex-col gap-3.5">
          {detail.whatWeBuild.map((item) => (
            <li key={item} className="flex gap-3.5">
              <span
                aria-hidden
                className="
                  mt-[3px] flex h-[18px] w-[18px] shrink-0 items-center justify-center
                  rounded-full border border-violet-400/25 bg-violet-500/10
                "
              >
                <Check size={11} strokeWidth={3} className="text-violet-300" />
              </span>
              <span className="text-[14px] leading-[1.7] text-white/65">
                {item}
              </span>
            </li>
          ))}
        </ul>
      </Block>

      <Block label="Key Benefits">
        <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
          {detail.benefits.map(({ label, Icon }) => (
            <li
              key={label}
              className="
                flex items-center gap-3 rounded-2xl
                border border-white/[0.07] bg-white/[0.03]
                px-3.5 py-3
                transition-colors duration-300
                hover:border-violet-400/25 hover:bg-white/[0.05]
              "
            >
              <Icon
                size={15}
                strokeWidth={1.8}
                className="shrink-0 text-violet-300/80"
              />
              <span className="text-[12.5px] font-medium leading-tight text-white/75">
                {label}
              </span>
            </li>
          ))}
        </ul>
      </Block>
    </div>

    {/* ── Technologies ─────────────────────────────────────── */}
    <Block label="Technologies Used">
      <ul className="flex flex-wrap gap-2.5">
        {detail.tech.map((name) => (
          <li
            key={name}
            className="
              rounded-full border border-white/[0.09] bg-white/[0.04]
              px-4 py-2
              text-[12.5px] font-medium tracking-[0.01em] text-white/70
              shadow-[inset_0_1px_0_rgba(255,255,255,.06)]
              transition-colors duration-300
              hover:border-violet-400/30 hover:text-white
            "
          >
            {name}
          </li>
        ))}
      </ul>
    </Block>

    {/* ── Delivery process ─────────────────────────────────── */}
    <Block label="Typical Delivery Process">
      <ol className="relative grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
        {/* Connecting rail, desktop only — the visual thread between steps */}
        <span
          aria-hidden
          className="
            pointer-events-none absolute left-0 right-0 top-[13px] hidden h-px lg:block
            bg-gradient-to-r from-violet-400/25 via-violet-400/15 to-transparent
          "
        />

        {detail.process.map(({ step, title, description }) => (
          <li key={step} className="relative">
            <span
              className="
                relative flex h-[27px] w-[27px] items-center justify-center
                rounded-full border border-violet-400/30
                bg-[#060612]
                text-[10.5px] font-semibold tracking-[0.06em] text-violet-300
              "
            >
              {step}
            </span>

            <h5 className="mt-4 font-['Space_Grotesk'] text-[14.5px] font-bold tracking-[-0.01em] text-white">
              {title}
            </h5>

            <p className="mt-2 text-[13px] leading-[1.65] text-white/50">
              {description}
            </p>
          </li>
        ))}
      </ol>
    </Block>
  </div>
);

export default ServiceDetails;