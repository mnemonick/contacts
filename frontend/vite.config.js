import {resolve} from 'node:path';
import {defineConfig} from 'vite';
import {fileURLToPath} from 'url';
import {dirname} from 'path';

let __filename = fileURLToPath(import.meta.url);
let __dirname = dirname(__filename);

export default defineConfig(args => {
  return {
    root: 'src',
    mode: 'development',
    build: {
      outDir: resolve(__dirname, '..', 'sender', 'dist'),
      minify: false,
      emptyOutDir: true
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src')
      }
    }
  }
})
