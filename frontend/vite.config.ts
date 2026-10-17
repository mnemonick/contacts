import { defineConfig } from "vite";
import deno from "@deno/vite-plugin";
import { sentryVitePlugin } from "@sentry/vite-plugin";
import { resolve } from "@std/path";
import secrets from "%/secrets.ts";

const dirname = import.meta.dirname as string;
const backend = resolve(dirname, "..", "backend").replaceAll("\\", "/");

export default defineConfig(({ mode }) => ({
  root: dirname,
  plugins: [
    ...deno(),
    sentryVitePlugin({
      ...secrets.sentry,
      telemetry: false,
      disable: mode === "development"
    })
  ],
  resolve: {
    alias: {
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
          groups: [
						{ name: "js-temporal", test: /js-temporal/ }
					]
        }
      }
    }
  }
}));
