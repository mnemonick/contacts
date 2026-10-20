import { defineConfig } from "vite";
import { sentryVitePlugin } from "@sentry/vite-plugin";
import { resolve } from "node:path";
import secrets from "../backend/secrets.ts";

const dirname = import.meta.dirname as string;
const root = resolve(dirname, "..").replaceAll("\\", "/");
const backend = resolve(dirname, "..", "backend").replaceAll("\\", "/");

export default defineConfig(({ mode }) => ({
  root: dirname,
  plugins: [
    sentryVitePlugin({
      ...secrets.sentry,
      telemetry: false,
      disable: mode === "development"
    })
  ],
  resolve: {
    alias: {
      "~": root,
      "#": dirname,
      "%": backend
    }
  },
  build: {
    outDir: resolve(dirname, "..", "sender", "public"),
    emptyOutDir: true,
    sourcemap: true,
    minify: mode === "production",
    rollupOptions: {
      treeshake: {
        moduleSideEffects: (id: string) => !id.replaceAll("\\", "/").startsWith(backend)
      },
      output: {
        codeSplitting: {
          groups: [{ name: "js-temporal", test: /js-temporal/ }]
        }
      }
    }
  }
}));
