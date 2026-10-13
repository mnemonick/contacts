import { defineConfig } from "vite";
import { sentryVitePlugin } from "@sentry/vite-plugin";
import args from "~/args.ts";

const dirname = import.meta.dirname as string;
const root = Deno.realPathSync(`${dirname}/..`);
const backend = Deno.realPathSync(`${root}/backend`);

export default defineConfig(({ mode }) => ({
	root: dirname,
	plugins: [
		sentryVitePlugin({
			...args.sentry,
			telemetry: false,
			disable: mode === "development"
		})
	],
	resolve: {
		alias: {
			"#": dirname,
			"%": backend,
			"~": root
		}
	},
	define: {
		BETTERSTACK: JSON.stringify(args.betterstack.dsn),
		MODE: JSON.stringify(mode)
	},
	build: {
		outDir: `${root}/sender/public`,
		emptyOutDir: true,
		sourcemap: true,
		minify: mode === "production",
		rollupOptions: {
			input: `${dirname}/index.html`,
			external: ["postgres"],
			treeshake: {
				moduleSideEffects: (id: string) => !id.startsWith(backend)
			},
			output: {
				assetFileNames: "assets/[name].[hash][extname]",
				entryFileNames: "assets/[name].[hash].js",
				chunkFileNames: "assets/[name].[hash].js",
				codeSplitting: {
					groups: [{ name: "temporal", test: /js-temporal/ }]
				}
			}
		}
	}
}));
