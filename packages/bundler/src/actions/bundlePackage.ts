import webpack from 'webpack';

import type { BundleOptions, BundleRequest, BundleResponse } from '../types';
import { getPlatformConfig } from '../utils/webpack';

/**
 * Bundle the package to a single file, using webpack.
 * It creates a single bundle per package entry point.
 * When using `exports`, it will create bundles for each entry point.
 */
export async function bundlePackage(
  request: BundleRequest,
  options: BundleOptions
): Promise<BundleResponse['output']> {
  const outputs: BundleResponse['output'] = {
    android: null,
    ios: null,
    web: null,
  };

  for (const platform of request.platforms) {
    const compiler = webpack(await getPlatformConfig(platform, request, options));

    outputs[platform] = await new Promise((resolve, reject) => {
      compiler.run((runError, stats) => {
        compiler.close((closeError) => {
          const error = runError || closeError;
          if (error) {
            reject(error);
          } else {
            resolve(stats);
          }
        });
      });
    });
  }

  return outputs;
}
