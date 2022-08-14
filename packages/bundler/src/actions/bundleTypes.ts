import fs from 'fs';
import path from 'path';

import type { BundleOptions, BundleRequest } from '../types';
import { getPackageDir, getPackageFile } from '../utils/package';
import { getDeclarationFiles, getTypesFromPackage } from '../utils/typescript';

/**
 * Find all types declaration of the package, and copy them.
 * This will either create an `index.d.ts`, or per `entry/index.d.ts`.
 * When other files are referenced, it will copy them too.
 */
export async function bundleTypes(request: BundleRequest, options: BundleOptions): Promise<void> {
  const pkgDir = getPackageDir(request, options);
  const pkg = await fs.promises
    .readFile(getPackageFile(request, options), 'utf-8')
    .then(JSON.parse);

  if (!pkg.exports) {
    const typeRoot = getTypesFromPackage(pkg);
    const typeFiles = typeRoot && getDeclarationFiles(path.join(pkgDir, typeRoot));

    if (!typeFiles || !typeFiles.length) {
      return;
    }

    await Promise.all(
      typeFiles.map(async (declaration) => {
        const typePath = path.relative(path.dirname(path.join(pkgDir, typeRoot)), declaration);
        const typeTarget = path.join(options.cwd, 'build', 'types', typePath);

        await fs.promises.mkdir(path.dirname(typeTarget), { recursive: true });
        await fs.promises.copyFile(declaration, typeTarget);
      })
    );
  }

  if (pkg.exports) {
    for (const exportEntry in pkg.exports) {
      const exportTypeRoot = getTypesFromPackage(pkg.exports[exportEntry]);
      const exportTypeFiles =
        exportTypeRoot && getDeclarationFiles(path.join(pkgDir, exportTypeRoot));

      if (!exportTypeFiles || !exportTypeFiles.length) {
        continue;
      }

      await Promise.all(
        exportTypeFiles.map(async (declaration) => {
          const typePath = path.relative(
            path.dirname(path.join(pkgDir, exportTypeRoot)),
            declaration
          );

          const typeTarget = path.join(
            options.cwd,
            'build',
            'types',
            path.join(path.normalize(exportEntry), typePath)
          );

          await fs.promises.mkdir(path.dirname(typeTarget), { recursive: true });
          await fs.promises.copyFile(declaration, typeTarget);
        })
      );
    }
  }
}
