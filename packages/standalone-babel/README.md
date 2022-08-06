# @acme/standalone-babel

A version of Babel to use in non-conventional environments, like React Native or the browser. It is bundled with various presets and plugins for React Native, to parse or transform code.

## Bundled plugins

- `@babel/core`
- `@babel/plugin-proposal-decorators`
- `@babel/plugin-proposal-dynamic-import`
- `@babel/plugin-proposal-nullish-coalescing-operator`
- `@babel/plugin-proposal-optional-chaining`
- `@babel/plugin-syntax-dynamic-import`
- `@babel/plugin-transform-arrow-functions`
- `@babel/plugin-transform-async-to-generator`
- `@babel/plugin-transform-shorthand-properties`
- `@babel/plugin-transform-template-literals`
- `@babel/preset-typescript`
- `metro-react-native-babel-preset`

## Installation

```bash
$ npm add @acme/standalone-babel
$ pnpm add @acme/standalone-babel
$ yarn add @acme/standalone-babel
```

## Usage

```js
import * as babel from '@acme/standalone-babel';

const filename = 'test.js';
const code = `...`;

const result = babel.transform(code, {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    ['@babel/plugin-transform-async-to-generator'],
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    // Other plugins
  ],
  moduleIds: false,
  sourceMaps: true,
  compact: false,
  filename,
  sourceFileName: filename,
});
```

## Caveats

Because this package is used in both React Native environments, and as drop-in replacement for `@babel/core` in `@acme/standalone-eslint`, we are using two separate entry points to avoid bundling unused code in a single entry point.

- `@acme/standalone-babel` → Default entry point and loads `./src/runtime.ts`.
- `@acme/standalone-babel/eslint` → `@babel/core` replacement for `@babel/eslint-parser` in [`@acme/standalone-eslint`](../standalone-eslint/README.md).

## Contributing

This package has a few commands, mainly to build, analyze and build for publishing.

- `pnpm dev` → Builds an unoptimized development build.
- `pnpm build` → Builds an optimized production build.
- `pnpm analyze` → Builds an optimized production build, and opens the Webpack bundle analyzer.

> When adding new packages, or upgrading old ones, make sure no Node dependencies are added with `pnpm analyze`. Also make sure only the minimum required code is being bundled, create patches if necessary.
