import path from "path";

import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'
import terser from '@rollup/plugin-terser'
import replace from '@rollup/plugin-replace'
import alias from '@rollup/plugin-alias'

export default function (args) {

  return {
    input: './src/_entry.js',
    plugins: [
      typescript()
    ],
    output: {
      file: path.resolve(import.meta.dirname, '..', 'sender', 'dist', 'bundle.js'),
      sourcemap: true
    }
  }
}