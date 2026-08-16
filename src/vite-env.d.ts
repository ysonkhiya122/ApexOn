/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_JOLPICA_BASE_URL: string;
  readonly VITE_OPENF1_BASE_URL: string;
  readonly VITE_ENABLE_CHAT: string;
  readonly VITE_ENABLE_GAMES: string;
  readonly VITE_APP_ENV: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
