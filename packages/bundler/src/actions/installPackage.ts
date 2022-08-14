import type { BundleRequest, BundleOptions, BundleInstaller } from '..';
import { getSpecifier } from '../utils/package';
import { spawnSafeAsync } from '../utils/spawn';

const DEFAULT_FLAGS = [
  '--ignore-scripts', // Don't want to run malicious post-install scripts.
  '--ignore-engines', // Sometimes sub-dependencies will want a specific version of Node. Don't care, try anyway.
  '--ignore-platform', // Some libraries use fsevents, which is not compatible on linux. Don't care, try anway.
  '--non-interactive', // In some cases yarn/npm will show an interactive prompt. Throw an error instead.
];

const installers: Record<
  BundleInstaller,
  (request: BundleRequest, options: BundleOptions) => Promise<void>
> = {
  yarn: installWithYarn,
  npm: installWithNpm,
};

export async function installPackage(request: BundleRequest, options: BundleOptions) {
  for (const installer of options.installer) {
    try {
      return await installers[installer](request, options);
    } catch {
      // try next
    }
  }

  throw new Error(`Unable to install with any of the packagers`);
}

async function installWithYarn(request: BundleRequest, { cwd }: BundleOptions) {
  const flags = [...DEFAULT_FLAGS, '--production']; // Don't need to install dev dependencies.

  await spawnSafeAsync('yarn', ['add', getSpecifier(request), ...flags], { cwd });
}

async function installWithNpm(request: BundleRequest, { cwd }: BundleOptions) {
  const flags = [...DEFAULT_FLAGS, '--omit=dev']; // Don't need to install dev dependencies.

  await spawnSafeAsync('npm', ['install', getSpecifier(request), ...flags], { cwd });
}
