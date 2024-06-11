import esbuild from 'esbuild';
import { omit } from 'ramda';
import packageJson from './package.json';
import { mkdir, rm, writeFile } from 'fs/promises';

esbuild
  .build({
    entryPoints: ['src/index.ts'],
    bundle: true,
    platform: 'node',
    outfile: 'dist/index.js',
    format: 'esm',
    external: getExternal(packageJson),
  })
  .catch(() => process.exit(1));

await rm('dist', { recursive: true, force: true });
await mkdir('dist');
await writeFile('dist/package.json', JSON.stringify(getDistPackageJson(packageJson), null, 2));

type PackageJson = {
  main?: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  bundledDependencies?: string[];
  scripts?: Record<string, string>;
};

function getExternal(packageJson: PackageJson) {
  const { dependencies, devDependencies } = getUnbundled(packageJson);

  return [...Object.keys(dependencies), ...Object.keys(devDependencies)];
}

function getDistPackageJson(packageJson: PackageJson): PackageJson {
  const { dependencies, devDependencies } = getUnbundled(packageJson);

  return {
    ...packageJson,
    main: 'index.js',
    scripts: {},
    dependencies,
    devDependencies: {},
    bundledDependencies: [],
  };
}

function getUnbundled(packageJson: PackageJson) {
  const { bundledDependencies = [], dependencies = {}, devDependencies = {} } = packageJson;

  const unbundledDependencies = omit(bundledDependencies, dependencies);
  const unbundledDevDependencies = omit(bundledDependencies, devDependencies);

  return {
    dependencies: unbundledDependencies,
    devDependencies: unbundledDevDependencies,
  };
}
