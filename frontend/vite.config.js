import {defineConfig} from 'vite';
import {resolve} from 'node:path';
import checker from 'vite-plugin-checker';

export default defineConfig(args => {
  return {
    root: 'src',
    mode: 'development',
    plugins: [
      checker({typescript: true}),
    ],
    resolve: {

    },
    build: {
      outDir: resolve(process.cwd(), '..', 'sender', 'dist'),
      minify: false,
      emptyOutDir: true,
      rollupOptions: {
        external: ['react']

      }
    }
  }
})