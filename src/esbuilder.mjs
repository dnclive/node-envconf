// amazing esbuild tool

import { build } from 'esbuild'

const isDev = process.env.NODE_ENV === "development"

// node ESM
await build({
  entryPoints: ['src/index.mjs'],
  bundle: true,
  minify: !isDev,
  sourcemap: isDev,
  outfile: 'build/index.mjs',
  platform: 'node',
  format: 'esm',
  packages: 'external',
  logLevel: 'info'
})

// browser CommonJS
/*await build({
  entryPoints: ['src/index.cjs'],
  bundle: true,
  minify: !isDev,
  sourcemap: isDev,
  outfile: 'build/index.cjs',
  platform: 'browser',
  format: 'cjs',
  packages: 'external',
  logLevel: 'info'
})*/

// web worker, etc...
/*
await build({
  entryPoints: ['src/index.cjs'],
  bundle: true,
  minify: !isDev,
  sourcemap: isDev,
  outfile: 'build/index.js',
  platform: 'browser',
  format: 'iife',
  logLevel: 'info'
})*/
