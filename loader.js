// (loader.ts)
// Uses tsconfig.json and createMatchPath (from tsconfig-paths lib) to implement a custom loader
// (resolve function) that applies path mappings like `@src/foo` --> `/path/to/app/build/src/foo.js`
// See also https://github.com/TypeStrong/ts-node/discussions/1450#discussion-3563207
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { basename, dirname, resolve as pathResolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { resolve as tsNodeResolve, load, getFormat, transformSource } from 'ts-node/esm';
import { createMatchPath } from 'tsconfig-paths';

export { load, getFormat, transformSource };

const __dirname = dirname(fileURLToPath(import.meta.url));

async function getTSConfig() {
  const maxDepth = 32; // arbitrary
  let depth = 0;
  let tsConfigFile = pathResolve(__dirname, 'tsconfig.json');
  while (!existsSync(tsConfigFile)) {
    tsConfigFile = pathResolve(dirname(tsConfigFile), '..', basename(tsConfigFile));
    depth++;
    if (depth > maxDepth) {
      throw Error(`maxDepth (${maxDepth}) exceeded while searching for tsconfig.json`);
    }
  }
  return JSON.parse(await readFile(tsConfigFile, 'utf-8'));
}

const matchPath = await (async () => {
  const tsConfig = await getTSConfig();
  const baseUrl = tsConfig.compilerOptions.baseUrl || '.';
  //   const outDir = tsConfig.compilerOptions.outDir || '.';
  const absoluteBaseUrl = pathResolve(baseUrl);
  const paths = tsConfig.compilerOptions.paths;
  return createMatchPath(absoluteBaseUrl, paths, undefined, true);
})();

export async function resolve(specifier, context, defaultResolve) {
  const mappedSpecifier = matchPath(specifier.replace(/(?:\.js)$/, '.ts'));

  if (mappedSpecifier) {
    specifier = mappedSpecifier;
  }

  return await tsNodeResolve(specifier, context, defaultResolve);
}
