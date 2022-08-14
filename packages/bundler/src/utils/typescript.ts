import fs from 'fs';
import path from 'path';

const { paperwork } = require('precinct');

/**
 * Get the type declarations path from package file, or exports entry.
 *
 * @see https://www.typescriptlang.org/docs/handbook/declaration-files/publishing.html
 */
export function getTypesFromPackage(pkg: Record<string, any>): undefined | string {
  return pkg.types ?? pkg.typings;
}

/**
 * Get the list of type declarations from a starting declaration.
 * This entry and the return values are absolute paths.
 */
export function getDeclarationFiles(entry: string): string[] {
  const map: Record<string, boolean> = {};

  function iterate(file: string) {
    const currentDir = path.dirname(file);
    const dependants = paperwork(file, { type: 'typescript' });

    map[file] = true;

    for (const dependant of dependants) {
      const currentDep = resolveDeclarationFile(path.resolve(currentDir, dependant));
      if (currentDep && !map[currentDep]) {
        iterate(currentDep);
      }
    }
  }

  iterate(resolveDeclarationFile(entry)!);

  return Object.keys(map);
}

/**
 * Try to resolve a declaration file, using either one of the methods:
 *   - ./file -> ./file.d.ts
 *   - ./file.d.ts -> ./file.d.ts
 *   - ./folder -> ./folder/index.d.ts
 *   - react -> undefined
 */
function resolveDeclarationFile(file: string): string | undefined {
  const stat = fs.statSync(file, { throwIfNoEntry: false });

  if (stat?.isFile()) {
    return file;
  }

  if (stat?.isDirectory()) {
    return path.join(file, 'index.d.ts');
  }

  if (fs.existsSync(`${file}.d.ts`)) {
    return `${file}.d.ts`;
  }

  return undefined;
}
