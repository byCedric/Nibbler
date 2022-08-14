const fs = require('fs');
const path = require('path');

const { getDeclarationFiles } = require('./build/utils/typescript');

const rootDir = path.resolve(__dirname, '..', '..', '.temp');
const pkgDir = path.join(rootDir, 'node_modules', '@shopify', 'react-native-skia');
const pkgFile = path.join(pkgDir, 'package.json');

const pkg = JSON.parse(fs.readFileSync(pkgFile, 'utf-8'));

const types = pkg.types ?? pkg.typings;

console.log(
  getDeclarationFiles(path.join(pkgDir, types))
);
