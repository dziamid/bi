import esbuild from 'esbuild';
import { omit } from 'ramda';
import packageJson from './package.json';

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

function getUnbundled(packageJson: PackageJson) {
  const { bundledDependencies = [], dependencies = {}, devDependencies = {} } = packageJson;

  const unbundledDependencies = omit(bundledDependencies, dependencies);
  const unbundledDevDependencies = omit(bundledDependencies, devDependencies);

  return {
    dependencies: unbundledDependencies,
    devDependencies: unbundledDevDependencies,
  };
}
