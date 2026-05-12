import {defineConfig} from 'vite'
import path from "path";

export default defineConfig(function() {
  let dist = path.resolve(import.meta.dirname, '..', 'sender', 'dist');

  return {
    root: './src',
    build: {
      outDir: dist,
      emptyOutDir: true
    }
  }
})