import {defineConfig, loadEnv} from 'vite'
import path from "path";

export default defineConfig(args => {
  const envDir = path.resolve(import.meta.dirname);
  const distDir = path.resolve(import.meta.dirname, '..', 'sender', 'dist');

  return {
    root: './src',
    envDir: envDir,
    build: {
      outDir: distDir,
      minify: args.prod === true,
      emptyOutDir: true,
      sourcemap: args.prod ? 'hidden' : 'inline',
      rollupOptions: {
        external: args.prod ? ['react', 'react-dom'] : []
      }
    },
    resolve: {
      alias: {
        '@': '/src'
      }
    }
  }
})