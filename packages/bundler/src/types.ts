/** The supported platforms to build for */
export type BundlePlatform = 'android' | 'ios' | 'web';

export type BundleInstaller = 'yarn' | 'npm';

export interface BundleRequest {
  /** The fully qualified package name to bundle, including scope */
  name: string;
  /** The exact version of the package to bundle */
  version: string;
  /** The platforms to bundle for */
  platforms: BundlePlatform[];
  /** The optional entry point to bundle, e.g. one of the `exports` from package */
  entry?: string;
}

export interface BundleOptions {
  /** The working directory to use for temporary files */
  cwd: string;
  /** The installer to use as array, it will try them all in cases of errors */
  installer: BundleInstaller[];
}

export interface BundleResponse {
  /** All found externals within this package */
  externals: string[];
  /** All dependencies of this package */
  dependencies: Record<string, { optional: boolean; version: string }>;
  /** The output for each individual platform */
  output: Record<BundlePlatform, any>;
}
