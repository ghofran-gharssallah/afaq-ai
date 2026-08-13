import { useCallback, useId, useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { AlertCircle, Check, ChevronDown, Loader2, Send } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import {
  EMAILJS_CONFIG,
  isEmailJsConfigured,
  type EmailTemplateParams,
} from "../../../config/emailjs";
import { EASE_OUT_EXPO } from "../../../constants/motion";
import { PROJECT_TYPES } from "./contact.data";

/**
 * The contact form.
 *
 * All EmailJS knowledge is confined to `submit()` below and the config module
 * — the rest is plain form state, so the transport can be swapped without
 * touching validation or markup.
 *
 * Validation runs on blur and again on submit. Errors are announced through
 * aria-invalid/aria-describedby, and status changes through a polite live
 * region, so the flow is usable without sight of the colour changes.
 */

type Field = "name" | "email" | "subject" | "message";
type Values = Record<Field, string>;
type Errors = Partial<Record<Field, string>>;
type Status = "idle" | "sending" | "success" | "error";

const EMPTY: Values = { name: "", email: "", subject: "", message: "" };

/** Deliberately permissive: shape check only, never a deliverability claim. */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const validate = (v: Values): Errors => {
  const e: Errors = {};
  if (!v.name.trim()) e.name = "Please enter your name.";
  if (!v.email.trim()) e.email = "Please enter your email.";
  else if (!EMAIL_RE.test(v.email.trim()))
    e.email = "That email address doesn't look right.";
  if (!v.subject) e.subject = "Please choose a project type.";
  if (!v.message.trim()) e.message = "Please tell us a little about the project.";
  else if (v.message.trim().length < 10)
    e.message = "A little more detail would help — at least 10 characters.";
  return e;
};

/* ── Shared field chrome, declared once ─────────────────────── */

const LABEL =
  "block text-[11px] font-semibold uppercase tracking-[0.2em] text-violet-300/70";

const CONTROL = `
  w-full rounded-[14px]
  border bg-white/[0.035]
  px-4 py-3.5
  text-[14.5px] text-white
  placeholder:text-white/25
  outline-none
  transition-[border-color,background-color,box-shadow] duration-300 ease-out
  focus:bg-white/[0.06]
  disabled:cursor-not-allowed disabled:opacity-50
`;

const controlBorder = (invalid: boolean) =>
  invalid
    ? "border-rose-400/50 focus:border-rose-400/70 focus:shadow-[0_0_0_3px_rgba(251,113,133,.14)]"
    : "border-white/[0.09] focus:border-violet-400/50 focus:shadow-[0_0_0_3px_rgba(164,124,237,.16)]";

const FieldError = ({ id, message }: { id: string; message?: string }) => (
  <AnimatePresence initial={false}>
    {message && (
      <motion.p
        id={id}
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        className="flex items-center gap-1.5 overflow-hidden pt-2 text-[12.5px] text-rose-300/90"
      >
        <AlertCircle size={13} strokeWidth={2.2} aria-hidden className="shrink-0" />
        {message}
      </motion.p>
    )}
  </AnimatePresence>
);

const ContactForm = () => {
  const reduced = useReducedMotion() ?? false;
  const uid = useId();

  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [failure, setFailure] = useState<string>("");

  /** Guards against a double submit landing between renders. */
  const inFlight = useRef(false);

  const setField = useCallback(
    (field: Field, value: string) => {
      setValues((prev) => ({ ...prev, [field]: value }));
      // Clear an error as soon as the user starts correcting it.
      setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));
      if (status === "error") setStatus("idle");
    },
    [status]
  );

  const blur = useCallback(
    (field: Field) => {
      setTouched((prev) => ({ ...prev, [field]: true }));
      setErrors((prev) => ({ ...prev, [field]: validate(values)[field] }));
    },
    [values]
  );

  const submit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (inFlight.current || status === "sending") return;

      const found = validate(values);
      setErrors(found);
      setTouched({ name: true, email: true, subject: true, message: true });

      if (Object.values(found).some(Boolean)) {
        // Move focus to the first problem so keyboard users are not stranded.
        const first = (["name", "email", "subject", "message"] as Field[]).find(
          (f) => found[f]
        );
        if (first) document.getElementById(`${uid}-${first}`)?.focus();
        return;
      }

      if (!isEmailJsConfigured) {
        setStatus("error");
        setFailure(
          "The contact form isn't connected yet. Please add the EmailJS values to .env."
        );
        return;
      }

      inFlight.current = true;
      setStatus("sending");
      setFailure("");

      const params: EmailTemplateParams = {
        name: values.name.trim(),
        email: values.email.trim(),
        subject: values.subject,
        message: values.message.trim(),
      };

      try {
        await emailjs.send(
          EMAILJS_CONFIG.serviceId,
          EMAILJS_CONFIG.templateId,
          params,
          { publicKey: EMAILJS_CONFIG.publicKey }
        );
        // Reset only once the send is confirmed.
        setStatus("success");
        setValues(EMPTY);
        setTouched({});
        setErrors({});
      } catch (err) {
        setStatus("error");
        setFailure(
          err instanceof Error && err.message
            ? `Something went wrong: ${err.message}`
            : "Something went wrong sending your message. Please try again."
        );
      } finally {
        inFlight.current = false;
      }
    },
    [status, uid, values]
  );

  const sending = status === "sending";

  /* ── Success takes over the panel ─────────────────────────── */
  if (status === "success") {
    return (
      <motion.div
        role="status"
        aria-live="polite"
        className="flex min-h-[420px] flex-col items-center justify-center px-6 text-center"
        initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.97, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: reduced ? 0.2 : 0.5, ease: EASE_OUT_EXPO }}
      >
        <span className="relative flex h-[62px] w-[62px] items-center justify-center rounded-full border border-violet-400/35 bg-violet-500/10">
          <span
            aria-hidden
            className="absolute -inset-2 rounded-full bg-violet-500/25 blur-xl"
          />
          <Check size={26} strokeWidth={2.4} className="relative text-violet-200" />
        </span>

        <h3 className="mt-7 font-['Space_Grotesk'] text-[22px] font-bold tracking-[-0.02em] text-white">
          Message sent
        </h3>
        <p className="mt-3 max-w-[380px] text-[14.5px] leading-[1.8] text-white/55">
          Thanks for reaching out — we&rsquo;ve got your message and will be in
          touch.
        </p>

        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="
            mt-8 rounded-full border border-white/12 bg-white/[0.04] px-6 py-3
            text-[13.5px] font-semibold text-white outline-none
            transition-all duration-300
            hover:border-violet-400/40 hover:bg-white/[0.07]
            focus-visible:ring-2 focus-visible:ring-violet-400/60
          "
        >
          Send another message
        </button>
      </motion.div>
    );
  }

  return (
    <form noValidate onSubmit={submit} className="flex flex-col gap-6">
      {/* Name │ Email */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor={`${uid}-name`} className={LABEL}>
            Name
          </label>
          <input
            id={`${uid}-name`}
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Your name"
            value={values.name}
            disabled={sending}
            onChange={(e) => setField("name", e.target.value)}
            onBlur={() => blur("name")}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? `${uid}-name-err` : undefined}
            className={`mt-3 ${CONTROL} ${controlBorder(Boolean(errors.name))}`}
          />
          <FieldError id={`${uid}-name-err`} message={touched.name ? errors.name : undefined} />
        </div>

        <div>
          <label htmlFor={`${uid}-email`} className={LABEL}>
            Email
          </label>
          <input
            id={`${uid}-email`}
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="you@company.com"
            value={values.email}
            disabled={sending}
            onChange={(e) => setField("email", e.target.value)}
            onBlur={() => blur("email")}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? `${uid}-email-err` : undefined}
            className={`mt-3 ${CONTROL} ${controlBorder(Boolean(errors.email))}`}
          />
          <FieldError
            id={`${uid}-email-err`}
            message={touched.email ? errors.email : undefined}
          />
        </div>
      </div>

      {/* Project type */}
      <div>
        <label htmlFor={`${uid}-subject`} className={LABEL}>
          Project type
        </label>
        <div className="relative mt-3">
          <select
            id={`${uid}-subject`}
            name="subject"
            value={values.subject}
            disabled={sending}
            onChange={(e) => setField("subject", e.target.value)}
            onBlur={() => blur("subject")}
            aria-invalid={Boolean(errors.subject)}
            aria-describedby={errors.subject ? `${uid}-subject-err` : undefined}
            className={`
              ${CONTROL} ${controlBorder(Boolean(errors.subject))}
              cursor-pointer appearance-none pr-11
              ${values.subject ? "text-white" : "text-white/25"}
            `}
          >
            <option value="" disabled className="bg-[#060612] text-white/40">
              Select a project type
            </option>
            {PROJECT_TYPES.map((t) => (
              <option key={t} value={t} className="bg-[#060612] text-white">
                {t}
              </option>
            ))}
          </select>
          <ChevronDown
            aria-hidden
            size={16}
            strokeWidth={2}
            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white/35"
          />
        </div>
        <FieldError
          id={`${uid}-subject-err`}
          message={touched.subject ? errors.subject : undefined}
        />
      </div>

      {/* Message */}
      <div>
        <label htmlFor={`${uid}-message`} className={LABEL}>
          Message
        </label>
        <textarea
          id={`${uid}-message`}
          name="message"
          rows={5}
          placeholder="What are you trying to build or automate?"
          value={values.message}
          disabled={sending}
          onChange={(e) => setField("message", e.target.value)}
          onBlur={() => blur("message")}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? `${uid}-message-err` : undefined}
          className={`mt-3 resize-y ${CONTROL} ${controlBorder(Boolean(errors.message))}`}
        />
        <FieldError
          id={`${uid}-message-err`}
          message={touched.message ? errors.message : undefined}
        />
      </div>

      {/* Send — the site's primary CTA, layer for layer */}
      <div className="flex flex-col gap-4 pt-1 sm:flex-row sm:items-center sm:gap-5">
        <button
          type="submit"
          disabled={sending}
          aria-busy={sending}
          className="
            group relative inline-flex h-[48px] min-w-[190px] items-center justify-center gap-2.5
            overflow-hidden rounded-full px-[34px]
            outline-none
            transition-all duration-300 ease-out
            hover:scale-[1.03]
            focus-visible:ring-2 focus-visible:ring-violet-400/60
            disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100
          "
        >
          <span className="absolute -inset-[3px] rounded-full bg-violet-500/30 opacity-55 blur-xl transition-all duration-300 group-hover:opacity-90 group-hover:blur-2xl" />
          <span className="absolute inset-0 rounded-full border border-[#D0C2E366] bg-[radial-gradient(circle_at_78%_25%,rgba(164,124,237,.45)_0%,transparent_30%),linear-gradient(90deg,#060612_0%,#14093A_20%,#3A1C91_48%,#7549D8_72%,#A47CED_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,.28),inset_0_-8px_12px_rgba(18,10,58,.45),0_10px_24px_rgba(117,73,216,.12)]" />
          <span className="absolute left-[9px] right-[9px] top-[1px] h-[7px] rounded-full bg-gradient-to-r from-transparent via-white/55 to-transparent opacity-80" />
          <span className="absolute inset-[1px] rounded-full bg-[radial-gradient(circle_at_80%_50%,rgba(255,255,255,.08),transparent_55%)] opacity-80" />

          {sending ? (
            <Loader2
              size={16}
              strokeWidth={2.4}
              aria-hidden
              className="relative z-10 animate-spin text-white"
            />
          ) : (
            <Send size={15} strokeWidth={2.2} aria-hidden className="relative z-10 text-white" />
          )}
          <span className="relative z-10 whitespace-nowrap text-[15px] font-semibold tracking-[-0.01em] text-white drop-shadow-[0_0_4px_rgba(255,255,255,.15)]">
            {sending ? "Sending…" : "Send Message"}
          </span>
        </button>

        <p className="text-[12.5px] leading-[1.6] text-white/35">
          We&rsquo;ll only use your details to reply to this enquiry.
        </p>
      </div>

      {/* Status — polite so it never interrupts typing */}
      <div aria-live="polite" className="min-h-0">
        <AnimatePresence initial={false}>
          {status === "error" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="overflow-hidden"
            >
              <div className="flex items-start gap-3 rounded-[14px] border border-rose-400/25 bg-rose-500/[0.07] px-4 py-3.5">
                <AlertCircle
                  size={15}
                  strokeWidth={2.2}
                  aria-hidden
                  className="mt-[2px] shrink-0 text-rose-300"
                />
                <p className="text-[13.5px] leading-[1.65] text-rose-100/85">
                  {failure}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </form>
  );
};

export default ContactForm;
