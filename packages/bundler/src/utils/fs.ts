import sluggify from '@sindresorhus/slugify';
import fs from 'fs';
import os from 'os';
import path from 'path';

const { name: directoryPrefix } = require('../../package.json');

/**
 * Create a directory which is considered temporary by the system.
 * Note, it's still recommended to clean the directory manually.
 */
export function temporaryDirectory(): Promise<string> {
  const temporaryPath = path.join(os.tmpdir(), sluggify(directoryPrefix));

  return fs.promises
    .mkdir(temporaryPath, { recursive: true })
    .then(() => fs.promises.realpath(temporaryPath))
    .then((real) => real.toString());
}

/**
 * Force remove a directory and it's content.
 * If the directory doesn't exists, it will continue.
 */
export function removeDirectory(dir: string): Promise<void> {
  return fs.promises.rm(dir, { force: true, recursive: true });
}
