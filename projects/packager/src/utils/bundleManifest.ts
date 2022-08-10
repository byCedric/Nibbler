import pacote from 'pacote';

import { BundleRequest } from './bundleRequest';

export type BundleManifest = Awaited<ReturnType<typeof fetchBundleManifest>>;

export function fetchBundleManifest({ name, version }: BundleRequest) {
  return pacote.manifest(`${name}@${version}`, { fullMetadata: true });
}
