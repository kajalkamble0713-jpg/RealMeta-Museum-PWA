#!/usr/bin/env node
/*
  Scans the repo for UTF-8 BOM (EF BB BF) in common source/config files.
  Use --check to fail if any are found, or --fix to strip them in-place.
*/

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const args = new Set(process.argv.slice(2));
const DO_FIX = args.has('--fix');
const DO_CHECK = args.has('--check') || !DO_FIX;

const IGNORED_DIRS = new Set([
  'node_modules',
  'build',
  'dist',
  '.git',
  '.github',
  '.next',
  'out',
  'coverage',
  '.turbo',
  '.vite'
]);

const EXTENSIONS = new Set([
  '.json', '.jsonc', '.js', '.cjs', '.mjs', '.ts', '.tsx', '.jsx', '.css', '.html'
]);

/** @param {string} dir */
function* walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.DS_Store')) continue;
    if (IGNORED_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walk(full);
    } else {
      const ext = path.extname(entry.name).toLowerCase();
      if (EXTENSIONS.has(ext)) yield full;
    }
  }
}

function hasBom(buf) {
  return buf.length >= 3 && buf[0] === 0xef && buf[1] === 0xbb && buf[2] === 0xbf;
}

let flagged = [];
for (const file of walk(ROOT)) {
  const buf = fs.readFileSync(file);
  if (hasBom(buf)) {
    flagged.push(file);
    if (DO_FIX) {
      fs.writeFileSync(file, buf.slice(3));
    }
  }
}

if (flagged.length) {
  const rel = flagged.map(f => path.relative(ROOT, f));
  if (DO_FIX) {
    console.log(`Stripped BOM from ${rel.length} file(s):`);
    for (const f of rel) console.log(` - ${f}`);
    process.exit(0);
  } else if (DO_CHECK) {
    console.error(`Found UTF-8 BOM in ${rel.length} file(s):`);
    for (const f of rel) console.error(` - ${f}`);
    process.exit(2);
  }
}
