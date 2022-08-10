import assert from 'assert';
import npa, { Result as Npa } from 'npm-package-arg';

import { ServerContext } from '../server';

export interface BundleRequest {
  /** The full name of the package, including optional scopes */
  name: string;
  /** The requested version, range, or dist-tag of the package */
  version: string;
  /** Optional entry point when using a different import path, e.g. `firebase/app` */
  entry?: string;
  /** The platforms to use when bundling */
  platforms: ('android' | 'ios' | 'web')[];
}

/** All allowed platforms to bundle, also serves as the default value for platforms */
const PLATFORMS: BundleRequest['platforms'] = ['android', 'ios', 'web'];

/**
 * Parse the bundle request and validate if everything is valid.
 */
export function parseBundleRequest({ request, params }: ServerContext): BundleRequest {
  const specifier = getPackageSpecifier(params);

  return {
    name: specifier.name!,
    version: specifier.fetchSpec!,
    entry: params.entry ?? undefined,
    platforms: getPackagePlatforms(request.query.platforms),
  };
}

/**
 * Create a unique hashe for the bundle request.
 * This uses all of the properties and will return patterns like:
 *   - expo@46.0.0?platforms=android,ios,web
 *   - firebase/app@9.9.2?platforms=android
 */
export function getBundleRequestCacheHash(bundleRequest: BundleRequest): string {
  const { name, version, platforms } = bundleRequest;
  const entry = bundleRequest.entry ? `/${bundleRequest.entry}` : '';

  return `${name}${entry}@${version}?platforms=${platforms.join(',')}`;
}

/**
 * Get the requested package specifier from router params.
 * This uses the following named parameters:
 *   - `scope` - the scope of the package, without `@`
 *   - `name` - the package name
 *   - `version` - the semver, dist-tag, or range (defaults to `latest`)
 */
function getPackageSpecifier({ scope, name, version = 'latest' }: ServerContext['params']): Npa {
  assert(name, 'No name provided in the bundle request');
  return scope ? npa(`@${scope}/${name}@${version}`) : npa(`${name}@${version}`);
}

/**
 * Get the requested platforms from the `platforms` query parameter string or string list.
 * It also validates that only allowed platforms are provided: "android", "ios", or "web".
 * When no platforms are provided, it will return all platforms.
 *
 * Note, the platforms are always returned in the same order (alphabetical).
 * This helps us generating the exact same hash for the platforms.
 */
function getPackagePlatforms(queryParam: string | string[] = ''): BundleRequest['platforms'] {
  const platforms = (Array.isArray(queryParam) ? queryParam : queryParam.split(','))
    .filter((platform) => !!platform)
    .map((platform) => platform.toLowerCase())
    .map((platform) => {
      assert(
        PLATFORMS.includes(platform as any),
        `Unknown platform provided: "${platform}", allowed platforms: "${PLATFORMS.join('", "')}"`
      );

      return platform as typeof PLATFORMS[number];
    })
    .sort(
      (a, b) =>
        PLATFORMS.findIndex((item) => item === a) - PLATFORMS.findIndex((item) => item === b)
    );

  return !platforms.length ? PLATFORMS : platforms;
}
