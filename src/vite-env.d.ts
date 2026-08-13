/// <reference types="vite/client" />

/**
 * Typed environment variables.
 *
 * All are optional: the app must build and run with an unconfigured contact
 * form (a fresh clone has no .env), so the config layer treats missing values
 * as "not configured" rather than throwing at import time.
 */
interface ImportMetaEnv {
  readonly VITE_EMAILJS_PUBLIC_KEY?: string;
  readonly VITE_EMAILJS_SERVICE_ID?: string;
  readonly VITE_EMAILJS_TEMPLATE_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
