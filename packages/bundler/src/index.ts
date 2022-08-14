import { bundlePackage } from './actions/bundlePackage';
import { bundleTypes } from './actions/bundleTypes';
import { installPackage } from './actions/installPackage';
import { BundleOptions, BundleRequest, BundleResponse } from './types';
import { temporaryDirectory, removeDirectory } from './utils/fs';

export * from './types';

/**
 * Bundle all files within the package to a single file.
 * This can be used to simplify loading the file somewhere else.
 */
export async function bundle(
  request: BundleRequest,
  input: Partial<BundleOptions> = {}
): Promise<BundleResponse> {
  const options = await getOptions(input);
  const response: BundleResponse = {
    externals: [],
    dependencies: {},
    output: {
      android: null,
      ios: null,
      web: null,
    },
  };

  try {
    await installPackage(request, options);
    response.output = await bundlePackage(request, options);
    await bundleTypes(request, options);
  } finally {
    // Clean up the temporary path, if used
    if (options.cwd !== input.cwd) {
      await removeDirectory(options.cwd);
    }
  }

  return response;
}

async function getOptions(options: Partial<BundleOptions>): Promise<BundleOptions> {
  return {
    cwd: options.cwd ?? (await temporaryDirectory()),
    installer: options.installer?.length ? options.installer : ['npm', 'yarn'],
  };
}
