import fs from 'fs';
import path from 'path';

import { BundleOptions, BundleRequest } from '../types';

export function getSpecifier({ name, version }: Pick<BundleRequest, 'name' | 'version'>): string {
  return `${name}@${version}`;
}

export function getPackageDir(
  request: Pick<BundleRequest, 'name'>,
  options: Pick<BundleOptions, 'cwd'>
): string {
  return path.join(options.cwd, 'node_modules', request.name);
}

export function getPackageFile(
  request: Pick<BundleRequest, 'name'>,
  options: Pick<BundleOptions, 'cwd'>
): string {
  return path.join(getPackageDir(request, options), 'package.json');
}

/**
 * Get an object with all entry points of the package.
 * This returns the named entry points, and not the actual file.
 * Webpack or Node should resolve these entry points on their own.
 *   - expo -> { index: 'expo' }
 *   - firebase -> { app: 'firebase/app', ... }
 */
export async function getEntryPoints(
  request: Pick<BundleRequest, 'name'>,
  options: Pick<BundleOptions, 'cwd'>
): Promise<Record<string, string>> {
  const pkg = await fs.promises
    .readFile(getPackageFile(request, options), 'utf-8')
    .then(JSON.parse);

  if (!pkg.exports) {
    return { index: request.name };
  }

  return Object.fromEntries(
    Object.keys(pkg.exports)
      .filter((exportName) => path.normalize(exportName).toLowerCase() !== 'package.json')
      .map((exportName) =>
        path.normalize(exportName) === '.'
          ? ['index', request.name]
          : [path.normalize(exportName), path.join(request.name, exportName)]
      )
  );
}
