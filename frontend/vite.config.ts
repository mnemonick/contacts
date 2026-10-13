import { defineConfig } from "vite";
import deno from "@deno/vite-plugin";
import { sentryVitePlugin } from "@sentry/vite-plugin";
import { resolve } from "@std/path";
import args from "~/args.ts";

const dirname = import.meta.dirname as string;
const backend = resolve(dirname, "..", "backend").replaceAll("\\", "/");

export default defineConfig(({ mode }) => ({
  root: dirname,
  plugins: [
    ...deno(),
    sentryVitePlugin({
      ...args.sentry,
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
  define: {
    BETTERSTACK: JSON.stringify(args.betterstack.dsn),
    MODE: JSON.stringify(mode)
  },
  build: {
    outDir: resolve(dirname, "..", "sender", "public"),
    emptyOutDir: true,
    sourcemap: true,
    minify: mode === "production",
    rollupOptions: {
      input: resolve(dirname, "index.html"),
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
