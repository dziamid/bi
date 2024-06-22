import esbuild, { type Metafile } from 'esbuild';
import { fromPairs, identity, pipe, sortBy, toPairs, uniq } from 'ramda';

import { mkdir, rm, writeFile } from 'fs/promises';
import * as yaml from 'js-yaml';
import { config } from 'dotenv';
import * as path from 'path';
import resolve from 'resolve';
import rootPackageJson from '../../../package.json';

await rm('dist', { recursive: true, force: true });
await mkdir('dist');

const result = await esbuild
  .build({
    entryPoints: ['src/index.ts'],
    bundle: true,
    platform: 'node',
    outfile: 'dist/index.js',
    format: 'esm',
    metafile: true,
    packages: 'external',
  })
  .catch(() => process.exit(1));
const { metafile } = result;

const dotenvConfig = config();
const envVarsYaml = yaml.dump(dotenvConfig.parsed);
await writeFile('dist/.env.yaml', envVarsYaml, 'utf-8');

const distPackageJson = await buildPackageJson(metafile);
await writeFile('dist/package.json', JSON.stringify(distPackageJson, null, 2));

async function buildPackageJson(metafile: Metafile) {
  const { dependencies, devDependencies } = getExternalDepsFromMetafile(metafile, rootPackageJson);
  return {
    main: 'index.js',
    type: 'module',
    scripts: {
      start: 'functions-framework --target=api3 --port=9001',
    },
    dependencies,
    devDependencies,
  };
}

function getExternalDepsFromMetafile(
  metafile: Metafile,
  packageJson: {
    dependencies: Record<string, string>;
    devDependencies: Record<string, string>;
  }
) {
  const clean = pipe(sortBy(identity), uniq);
  const externalImports = metafile.outputs['dist/index.js']?.imports
    .filter((i) => i.external === true)
    .map((i) => i.path);

  const externalImportsClean = clean(externalImports ?? []);
  const projectRootDir = path.resolve(process.cwd(), '..');
  const externalPackages = clean(externalImportsClean.map((i) => resolvePackageName(i, projectRootDir)));
  const dependencies = fromPairs(toPairs(packageJson.dependencies).filter(([name]) => externalPackages.includes(name)));
  const devDependencies = fromPairs(
    toPairs(packageJson.devDependencies).filter(([name]) => externalPackages.includes(name))
  );
  return { dependencies, devDependencies };
}

function resolvePackageName(importStatement: string, basedir: string): string | undefined {
  try {
    const resolvedPath = resolve.sync(importStatement, { basedir });
    // Find the node_modules directory in the resolved path
    const nodeModulesIndex = resolvedPath.indexOf('node_modules');
    if (nodeModulesIndex === -1) {
      // Not a third-party module, return null or handle accordingly
      return undefined;
    }

    // Extract the package name from the resolved path
    const pathAfterNodeModules = resolvedPath.substring(nodeModulesIndex + 'node_modules/'.length);
    const packageNameParts = pathAfterNodeModules.split(path.sep);
    const packageName = packageNameParts[0]?.startsWith('@')
      ? `${packageNameParts[0]}/${packageNameParts[1]}`
      : packageNameParts[0];

    return packageName;
  } catch (err) {
    console.log(`Could not resolve import statement: ${importStatement}, ignoring`);
    return undefined;
  }
}
