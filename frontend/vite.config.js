import {defineConfig} from 'vite';
import {resolve} from "node:path";

export default defineConfig(() => {
  return {
    root: 'src',
    build: {
      outDir: resolve(process.cwd(), './dist')
    }
  }
})