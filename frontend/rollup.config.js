import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'
import terser from '@rollup/plugin-terser'
import replace from '@rollup/plugin-replace'

import {fileURLToPath} from "url";
import path from "node:path";

let __filename = fileURLToPath(import.meta.url);
let __dirname = path.dirname(__filename);

export default {
  input: './src/index.ts',
  plugins: [
    typescript()
  ],
  output: [
    {
      file: path.resolve(__dirname, '..', 'sender', 'dist', 'bundle.js'),
    }
  ]
}