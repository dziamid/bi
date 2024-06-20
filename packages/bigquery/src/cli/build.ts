import esbuild from 'esbuild';
import { mkdir, rm } from 'fs/promises';
import {execSync} from "node:child_process";

await rm('dist', { recursive: true, force: true });
await mkdir('dist');

execSync('tsc'); // definition files

esbuild
  .build({
    entryPoints: ['src/index.ts'],
    bundle: true,
    platform: 'node',
    outfile: 'dist/index.js',
    format: 'esm',
    packages: 'external',
  })
  .catch(() => process.exit(1));
