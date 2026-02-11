/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ADMIN_EMAIL?: string;
  readonly VITE_GEONAMES_USERNAME?: string;
  readonly VITE_SENTRY_DSN?: string;
  readonly VITE_ANALYTICS_ENDPOINT?: string;
  readonly VITE_APP_VERSION?: string;
  readonly GEMINI_API_KEY?: string;
  readonly DEV: boolean;
  readonly PROD: boolean;
  readonly MODE: string;
  [key: string]: string | boolean | undefined;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

