// Constants that vite.config.ts substitutes at build time (define), taken from the root args.ts.
declare global {
  const BETTERSTACK: string;
  const MODE: "development" | "production";
}

export {};
