/* eslint-disable */

declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: string;
    VUE_ROUTER_MODE: 'hash' | 'history' | 'abstract' | undefined;
    VUE_ROUTER_BASE: string | undefined;
  }
}

/// <reference types="vite/client" />

interface ImportMetaEnv{
  readonly VITE_APP_NAME: string
  readonly VITE_APP_VERSION: string
  readonly VITE_APP_API_URL: string
  readonly VITE_APP_DEFAULT_MAIN_PHOTO: string

  readonly VITE_APP_PRIMARY_COLOR: string
  readonly VITE_APP_SECONDARY_COLOR: string
  readonly VITE_APP_ACCENT_COLOR: string
  readonly VITE_APP_DARK_COLOR: string
  readonly VITE_APP_DARK_PAGE_COLOR: string
  readonly VITE_APP_POSITIVE_COLOR: string
  readonly VITE_APP_NEGATIVE_COLOR: string
  readonly VITE_APP_INFO_COLOR: string
  readonly VITE_APP_WARNING_COLOR: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
