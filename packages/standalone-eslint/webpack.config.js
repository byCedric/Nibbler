const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
const path = require('path');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const {
  /** Enable the bundle analyzer to validate the output after updating */
  WEBPACK_ANALYZE,
  /** Enable production mode to output the most optimized bundle */
  WEBPACK_PRODUCTION,
} = process.env;

/**
 * This configuration is based on ESLint's and the playground webpack config
 * It creates a standalone build to use in non-conventional environments.
 *
 * @see https://github.com/eslint/eslint/blob/v8.20.0/webpack.config.js
 * @see https://github.com/eslint/playground/blob/main/webpack.config.js
 * @type {import('webpack').Configuration}
 */
const config = {
  mode: 'development',
  entry: {
    eslint: path.resolve(__dirname, 'src/eslint.ts'),
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name].js',
    libraryTarget: 'commonjs2',
    globalObject: 'this',
  },
  plugins: [new NodePolyfillPlugin()],
  module: {
    rules: [
      {
        test: /\.(ts|js|mjs)$/u,
        include: [path.resolve(__dirname, 'src')],
        exclude: [path.resolve(__dirname, 'node_modules')],
        use: { loader: 'babel-loader' },
      },
    ],
  },
  stats: 'errors-only',
  resolve: {
    extensions: ['.js', '.ts'],
    mainFields: ['browser', 'main', 'module'],
    fallback: {
      fs: false,
    },
  },
  externals: {
    // This "hot-wires" the core to Babel standalone, bundled with presets and plugins.
    // It's required for the `@babel/eslint-parser` to resolve the right libraries.
    // We don't use aliases, because we want to be able to split it in chunks when installed.
    '@babel/core': 'commonjs2 @acme/standalone-babel/eslint',
  },
};

// We want to optimize the bundle output to minimize the size of the bundle
if (WEBPACK_PRODUCTION || WEBPACK_ANALYZE) {
  config.mode = 'production';
  config.devtool = false;
  config.optimization = {
    minimize: true,
  };

  // We want to be able to analyze the bundle size, in case we need to update it
  if (WEBPACK_ANALYZE) {
    config.plugins.push(new BundleAnalyzerPlugin());
  }
}

module.exports = config;
