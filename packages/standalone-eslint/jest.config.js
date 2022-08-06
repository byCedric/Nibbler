const path = require('path');

/** @type {import('@jest/types').Config.InitialOptions} */
module.exports = {
  roots: [path.resolve('./src')],
  testMatch: ['**/?(*.)+(spec|test).[jt]s?(x)'],
  transform: {
    '\\.[jt]sx?$': 'babel-jest',
  },
  moduleNameMapper: {
    // This "hot-wires" the Babel standalone version, see webpack for more info.
    '@babel/core': require.resolve('@acme/standalone-babel/eslint'),
  },
};
