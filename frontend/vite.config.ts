import { defineConfig, loadEnv } from "vite";
import path from "path";
import react from "@vitejs/plugin-react";

// @ts-ignore
export default defineConfig((args) => {
	const envDir = path.resolve(import.meta.dirname);
	const distDir = path.resolve(import.meta.dirname, "..", "sender", "dist");

	return {
		root: "./src",
		envDir: envDir,
		plugins: [react()],
		build: {
			outDir: distDir,
			minify: args.mode === "production",
			emptyOutDir: true,
			sourcemap: args.mode === "production" ? "hidden" : "inline",
			rollupOptions: {
				external: args.mode === "production" ? ["react", "react-dom"] : [],
			},
		},
	};
});
