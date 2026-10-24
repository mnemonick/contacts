import { defineConfig } from "vite";
import { resolve } from "node:path";

const dirname = import.meta.dirname as string;

export default defineConfig(({ mode }) => ({
  root: dirname,
  define: {
    "process.env.NODE_ENV": JSON.stringify(mode)
  },
  resolve: {
    tsconfigPaths: true
  },
  build: {
    outDir: resolve(dirname, "..", "sender", "public"),
    emptyOutDir: true,
    sourcemap: true,
    minify: mode === "production"
  }
}));
