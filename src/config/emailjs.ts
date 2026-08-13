/**
 * EmailJS configuration — the single place these values are read.
 *
 * Values come from environment variables so nothing is hard-coded in source
 * and nothing sensitive is committed. Fill them in `.env` (git-ignored); see
 * `.env.example` for the keys and where to find them.
 *
 * SECURITY
 * Vite inlines every VITE_-prefixed variable into the client bundle, so these
 * three values are publicly readable in the shipped JavaScript. That is
 * EmailJS's intended client-side model and is fine for their *public* key —
 * but it means the bundle is not a place for secrets. An SMTP password, a
 * private API key or a server token would be exposed the moment it landed
 * here, and would need a backend endpoint instead.
 *
 * Because the public key is readable, lock it down in the EmailJS dashboard:
 * restrict it to your domain and leave the rate limit on, or someone can lift
 * it from the bundle and send through your template.
 */
export const EMAILJS_CONFIG = {
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY ?? "",
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID ?? "",
  templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID ?? "",
} as const;

/**
 * True only when all three values are present.
 *
 * The form checks this before attempting a send, so an unconfigured build
 * fails with a clear message instead of an opaque EmailJS rejection.
 */
export const isEmailJsConfigured =
  EMAILJS_CONFIG.publicKey.length > 0 &&
  EMAILJS_CONFIG.serviceId.length > 0 &&
  EMAILJS_CONFIG.templateId.length > 0;

/**
 * Template variables sent to EmailJS.
 *
 * These names must match the placeholders in your EmailJS template exactly —
 * `{{name}}`, `{{email}}`, `{{subject}}`, `{{message}}`. To make replies go
 * to the sender, point your template's "Reply-To" field at `{{email}}` in the
 * dashboard rather than adding another variable here.
 */
export interface EmailTemplateParams extends Record<string, string> {
  name: string;
  email: string;
  subject: string;
  message: string;
}
